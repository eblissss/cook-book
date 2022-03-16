package routes

import (
	"context"
	"fmt"
	"math/rand"
	"net/http"
	"server/client/email"
	"server/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var validate = validator.New()
var userCollection *mongo.Collection = OpenCollection(Client, "users")
var pendingUserCollection *mongo.Collection = OpenCollection(Client, "pending_users")
var mailClient = email.Must(email.New())

func AuthUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Unwrap request into AuthUser
	user := &models.AuthUser{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// TODO: check email valid
	// TODO: check username valid

	rand.Seed(time.Now().UnixNano())
	user.Code = 1e5 + rand.Intn(1e6-1e5) // [100000,999999]
	user.Expires = time.Now().Add(15 * time.Minute)
	// Add AuthUser
	if _, err := pendingUserCollection.InsertOne(ctx, *user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not added to auth base"})
		fmt.Println(err)
		return
	}

	// Send Email
	if err := mailClient.SendEmail(user.Email, user.Email); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println("Email sent successfully")
	c.JSON(http.StatusOK, gin.H{
		"expires": user.Expires,
	})

}

func RegisterUser(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	// Unwrap request into user
	user := &models.User{}
	if err := c.BindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}
	if err := validate.Struct(user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	// Check for taken username
	if res := userCollection.FindOne(ctx, bson.M{
		"username": user.Username,
	}); res.Err() == nil {
		err := fmt.Sprintf("username taken: %s", user.Username)
		c.JSON(http.StatusConflict, gin.H{"error": err})
		fmt.Println(err)
		return
	}

	user.UserID = primitive.NewObjectID()
	user.CreatedAt = time.Now().String()
	user.UpdatedAt = time.Now().String()

	// Insert user
	result, err := userCollection.InsertOne(ctx, *user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "user was not created"})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"userID": result.InsertedID,
	})
}

func LogIn(c *gin.Context) {
	// 	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	// 	defer cancel()

	// 	user := &models.User{}
	// 	un := c.Params.ByName("username")
	// 	pw := c.Params.ByName("password")

	// 	err := userCollection.Find(ctx, bson.M{
	// 		"username": un,
	// 		"password": pw,
	// 	}).Decode(&user)

	// 	if err.Err() != nil {
	// 		err := fmt.Sprintf("Username not found: %s", Username)
	// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	// 		fmt.Println(err)
	// 		return
	// 	}

	// 	c.JSON(http.StatusOK, responses.UserResponse{Status: http.StatusOK, Message: "success", Data: gin.H{"data": user}})
}
