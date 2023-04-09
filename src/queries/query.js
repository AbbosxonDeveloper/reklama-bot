export const findUser = `
    select * from users
    where
    id = $1
`

export const newUser = `
    insert into users(id, username) values
    ($1, $2)
`