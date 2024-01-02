# To do

- [x] design table schema
- [x] populate test users and bounties manually
- [x] make a way to display them 
- [x] log way more data in (manually in supabase)
- [ ] add tags to posts
- [x] clickable navigable top bar as header 
  - [ ] make horizontal (and nice looking) 
  - [ ] get `public_user` query to actually run. 
- [ ] supabase functions or webhooks to listen for new signups and sync to custom users table
  - [ ] elicit `display_name`, `lw_username`, `bio` etc. in user signup. 
- [ ] google auth (checkbox with creds in supabase)
- [ ] edit profiles functionality

## in advance of jan 1st sync: 
- [ ] post card
  - [x] post card in list form for homepage and profile
  - [ ] post card in solo form for solo page
- [ ] eslint config
- [ ] route up posts (stretch) 

# Views
- [ ] homepage
  - [x] list of bounties
- [ ] profile
  - [x] base profile with bio
  - [x] profile with list of posts
    - [ ] allow a username argument in `Posts.tsx` component that returns all posts if `null`.
  - [ ] profile with list of claims

# Routes
- [ ] posts as base_url/username>/slug-uid
- [ ] profiles as base_url/username
