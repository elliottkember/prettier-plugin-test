"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    constructor() {
        this.retryCount = 0;
    }
    // Simulates fetching data from an external API or database
    fetchUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulating a delay and possible failure
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (Math.random() < 0.3) {
                        reject(new Error("Failed to fetch users. Retrying..."));
                    }
                    else {
                        resolve([
                            {
                                id: 1,
                                name: "John Doe",
                                age: 29,
                                location: "New York",
                                isActive: true,
                            },
                            {
                                id: 2,
                                name: "Jane Smith",
                                age: 22,
                                location: "San Francisco",
                                isActive: false,
                            },
                            {
                                id: 3,
                                name: "Tom Brown",
                                age: 35,
                                location: "Chicago",
                                isActive: true,
                            },
                            {
                                id: 4,
                                name: "Emily White",
                                age: 27,
                                location: "New York",
                                isActive: true,
                            },
                            {
                                id: 5,
                                name: "Sam Green",
                                age: 40,
                                location: "Los Angeles",
                                isActive: false,
                            },
                        ]);
                    }
                }, 1000);
            });
        });
    }
    // Retry mechanism for the fetch operation
    fetchWithRetry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.fetchUsers();
                this.retryCount = 0; // Reset retry count on success
                return users;
            }
            catch (error) {
                if (this.retryCount < UserService.MAX_RETRIES) {
                    this.retryCount++;
                    console.warn(`Retry ${this.retryCount}/${UserService.MAX_RETRIES}`);
                    return this.fetchWithRetry();
                }
                else {
                    throw new Error("Max retries reached. Could not fetch users.");
                }
            }
        });
    }
    // Applies filtering based on the given criteria
    filterUsers(users, criteria) {
        return users.filter((user) => {
            const matchesAge = (criteria.minAge === undefined || user.age >= criteria.minAge) &&
                (criteria.maxAge === undefined || user.age <= criteria.maxAge);
            const matchesLocation = criteria.locations === undefined ||
                criteria.locations.includes(user.location);
            const matchesActivity = criteria.isActive === undefined || user.isActive === criteria.isActive;
            return matchesAge && matchesLocation && matchesActivity;
        });
    }
    // Logs the final result to console
    logResults(users) {
        if (users.length === 0) {
            console.log("No users found matching the criteria.");
        }
        else {
            console.log(`Found ${users.length} users:`);
            users.forEach((user) => {
                console.log(`- ${user.name}, Age: ${user.age}, Location: ${user.location}, Active: ${user.isActive}`);
            });
        }
    }
    // Main function that combines fetching, filtering, and logging
    fetchAndProcessUsers(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Fetching users...");
                const users = yield this.fetchWithRetry();
                console.log("Filtering users...");
                const filteredUsers = this.filterUsers(users, criteria);
                console.log("Logging results...");
                this.logResults(filteredUsers);
            }
            catch (error) {
                console.error("Error during user processing:");
            }
        });
    }
}
UserService.MAX_RETRIES = 3;
// Example usage:
const userService = new UserService();
// Define filter criteria: min age 25, only New York and San Francisco users, and active users only
const criteria = {
    minAge: 25,
    locations: ["New York", "San Francisco"],
    isActive: true,
};
// Call the main function to fetch, filter, and process users based on the criteria
userService.fetchAndProcessUsers(criteria);
