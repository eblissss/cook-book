package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	UserID    primitive.ObjectID `json:"userID"`
	Username  string             `json:"username"`
	FirstName string             `json:"firstName"`
	LastName  string             `json:"lastName"`
	Email     string             `json:"email"`
	Password  string             `json:"password"`
	CreatedAt string             `json:"createdAt"`
	UpdatedAt string             `json:"updatedAt"`
}

type AuthUser struct {
	Username string    `json:"username"`
	Email    string    `json:"email"`
	Expires  time.Time `json:"expires"`
	Code     int
}
