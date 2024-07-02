## 📜 Project Overview :

- **Project Concept** : This server-side component supports the volunteer needs website, connecting volunteers with organizations requiring assistance.
- **Problem Solved** : Management of volunteers and protection of information as required.


---

## 🌟 Features

### User Authentication and Authorization :
- **Secure** login and role-based access control for administrators and employees.

### Opportunity Management :
- **CRUD** operations for managing volunteer opportunities, applications, and matches.

### Advanced Search and Filtering :
- **You can search** based on category and view information in card or table format.

---

## 🛠 Technology Used : 
**JWT**, **MongoDB

## How to Clone and Run the Project Locally : 

1. **Clone the repository:**
   - First, you need to clone the **client** and **server side**. Open your terminal and type:
     ```bash
     git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY
     ```
2. **Open files in VS Code:**
   - After opening the **server-side** files in VS Code, install npm dependencies both file:
     ```bash
     npm install
     ```
3. **Environment setup:**
   - In your server side configure environment variables by creating a `.env` file in the root directory. Add the following variables:
     ```plaintext
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/art_and_craft_db
     JWT_SECRET=your_jwt_secret_key_here
     ```
     Replace `your_jwt_secret_key_here` with your actual keys.
4. **Access the server :**
   - run code is `nodemon index.js ` or `npm run dev` and also check which file are you now. 
   - Open your web browser and navigate to `http://localhost:3000` to view the application locally.
