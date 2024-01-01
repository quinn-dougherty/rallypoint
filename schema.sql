-- NOT THE SOURCE OF TRUTH. Source of truth is in supabase console.

-- users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    lw_username VARCHAR(255) UNIQUE,
    profile_image_url TEXT,
    balance DECIMAL(10, 4) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE POST_TYPE AS ENUM ('bounty', 'dac');
CREATE TYPE STATUS_TYPE AS ENUM ('unclaimed', 'claimed', 'finished');

CREATE TABLE posts (
    post_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID REFERENCES users(user_id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    post_type POST_TYPE DEFAULT 'bounty',
    amount DECIMAL(10, 4),
    status STATUS_TYPE DEFAULT 'unclaimed',
    deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE claims (
    claim_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES posts(post_id),
    claimant_user_id UUID REFERENCES users(user_id),
    claimed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deadline TIMESTAMP WITH TIME ZONE,
    status STATUS_TYPE DEFAULT 'claimed',
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP WITH TIME ZONE, -- Optional, tracks when the claim was resolved
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- payments
CREATE TABLE payments_deposit (
    deposit_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    amount DECIMAL(10, 2) NOT NULL,
    stripe_payment_id VARCHAR(255), -- Reference to Stripe's payment ID for the deposit
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE payments_allocation (
    allocation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    post_id UUID REFERENCES posts(post_id), -- The post to which funds are allocated
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE payments_claim_withdrawal (
    withdrawal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    claim_id UUID REFERENCES claims(claim_id), -- The claim for which the withdrawal is made
    amount DECIMAL(10, 2) NOT NULL,
    stripe_payment_id VARCHAR(255), -- Reference to Stripe's payment ID for the withdrawal
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
