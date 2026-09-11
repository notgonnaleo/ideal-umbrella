CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    sharer_user_id VARCHAR(64) NOT NULL,
    status SMALLINT NOT NULL DEFAULT 1

    FOREIGN KEY (room_id)
        REFERENCES rooms (id)
        ON DELETE CASCADE
);
