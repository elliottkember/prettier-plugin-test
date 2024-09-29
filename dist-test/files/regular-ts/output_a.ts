type User = {
  id: number;
  name: string;
  age: number;
  location: string;
  isActive: boolean;
};

type FilterCriteria = {
  minAge?: number;
  maxAge?: number;
  locations?: string[];
  isActive?: boolean;
};

class UserService {
  private static readonly MAX_RETRIES = 3;
  private retryCount = 0;

  // Simulates fetching data from an external API or database
  private async fetchUsers(): Promise<User[]> {
    // Simulating a delay and possible failure
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() < 0.3) {
          reject(new Error("Failed to fetch users. Retrying..."));
        } else {
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
  }

  // Retry mechanism for the fetch operation
  private async fetchWithRetry(): Promise<User[]> {
    try {
      const users = await this.fetchUsers();
      this.retryCount = 0; // Reset retry count on success
      return users;
    } catch (error) {
      if (this.retryCount < UserService.MAX_RETRIES) {
        this.retryCount++;
        console.warn(`Retry ${this.retryCount}/${UserService.MAX_RETRIES}`);
        return this.fetchWithRetry();
      } else {
        throw new Error("Max retries reached. Could not fetch users.");
      }
    }
  }

  // Applies filtering based on the given criteria
  private filterUsers(users: User[], criteria: FilterCriteria): User[] {
    return users.filter((user) => {
      const matchesAge =
        (criteria.minAge === undefined || user.age >= criteria.minAge) &&
        (criteria.maxAge === undefined || user.age <= criteria.maxAge);
      const matchesLocation =
        criteria.locations === undefined ||
        criteria.locations.includes(user.location);
      const matchesActivity =
        criteria.isActive === undefined || user.isActive === criteria.isActive;

      return matchesAge && matchesLocation && matchesActivity;
    });
  }

  // Logs the final result to console
  private logResults(users: User[]): void {
    if (users.length === 0) {
      console.log("No users found matching the criteria.");
    } else {
      console.log(`Found ${users.length} users:`);
      users.forEach((user) => {
        console.log(
          `- ${user.name}, Age: ${user.age}, Location: ${user.location}, Active: ${user.isActive}`,
        );
      });
    }
  }

  // Main function that combines fetching, filtering, and logging
  public async fetchAndProcessUsers(criteria: FilterCriteria): Promise<void> {
    try {
      console.log("Fetching users...");
      const users = await this.fetchWithRetry();
      console.log("Filtering users...");
      const filteredUsers = this.filterUsers(users, criteria);
      console.log("Logging results...");
      this.logResults(filteredUsers);
    } catch (error) {
      console.error("Error during user processing:");
    }
  }
}

// Example usage:
const userService = new UserService();

// Define filter criteria: min age 25, only New York and San Francisco users, and active users only
const criteria: FilterCriteria = {
  minAge: 25,
  locations: ["New York", "San Francisco"],
  isActive: true,
};

// Call the main function to fetch, filter, and process users based on the criteria
userService.fetchAndProcessUsers(criteria);

export {};
