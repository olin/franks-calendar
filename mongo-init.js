db.createUser(
    {
        user: "frank",
        pwd: "calendar",
        roles: [
            role: "readWrite",
            db: "calendar-dev"
        ]
    }
)
