import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { GetUser } from "@/utils/userData";

const lesswrongEndpoint = "https://www.lesswrong.com/graphql";

interface lesswrongApiResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

type lesswrongLoginResponse = lesswrongApiResponse<{
  login: {
    token: string;
  };
}>;

type UserProfile = {
  username: string;
  displayName: string;
  email: string;
  _id: string;
};

const fetchProfile = async (token: string): Promise<UserProfile> => {
  // username is the only field required
  const query = `
    query {
      currentUser {
        username
        displayName
        email
        _id
      }
    }
  `;
  // change later
  const headers = {
    Cookie: `loginToken=${token}`,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0",
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  console.log("fetching,", headers);

  const response = await fetch(lesswrongEndpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({ query }),
  });

  const result = await response.json();
  console.log("userdata:", result);
  return result.data.currentUser;
};

const lesswrongAuth = async (
  username: string,
  password: string,
): Promise<{ token: string; userProfile: UserProfile }> => {
  const fetch = (await import("node-fetch")).default;

  const query = `
    mutation {
      login(username: "${username}", password: "${password}") {
        token
      }
    }
  `;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/119.0",
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    console.log("query", query);

    const response = await fetch(lesswrongEndpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ query }),
    });

    const result = (await response.json()) as lesswrongLoginResponse;

    if (result.errors) {
      throw new Error(result.errors[0].message);
    }

    const token = result.data?.login.token;
    console.log(token);

    if (!token) {
      throw new Error("No token received.");
    }

    // Fetch the user's profile using the token
    const userProfile = await fetchProfile(token);
    console.log("userprofile:", userProfile);
    return { token, userProfile };
  } catch (error) {
    console.error("Error in Lesswrong login", error);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { username, password } = await req.json();
    const { token, userProfile } = await lesswrongAuth(username, password);

    if (!token || !userProfile) {
      throw new Error("Authentication failed");
    }

    const user = await GetUser();

    const { error } = await supabase
      .from("profiles")
      .update({ lw_username: userProfile.username })
      .match({ user_id: user.id });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return new Response(JSON.stringify({ userProfile }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in Lesswrong login", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
