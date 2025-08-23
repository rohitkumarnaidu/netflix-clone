# 🗄️ MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended for beginners)

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create a free account**
3. **Create a new cluster (free tier)**
4. **Get your connection string**
5. **Update your `config.env` file**

## Option 2: Local MongoDB Installation

### Windows with Chocolatey (Run as Administrator):
```powershell
choco install mongodb --yes
```

### Windows Manual Installation:
1. Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Start MongoDB service

### Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Option 3: Temporary In-Memory Database (For Testing)

For now, let's use a temporary solution to test your API without installing MongoDB.

---

## 🚀 Quick Start (Choose one):

### A) Use MongoDB Atlas (Recommended):
- Follow Option 1 above
- Update `config.env` with your Atlas connection string

### B) Use Local MongoDB:
- Follow Option 2 above
- Make sure MongoDB is running on port 27017

### C) Use Temporary Solution:
- We'll modify the code to work without MongoDB temporarily
- Good for testing the API structure

---

## 📝 Next Steps:
1. Choose your preferred option
2. Let me know which one you want to use
3. I'll help you complete the setup
4. Test your trending movies API!

**Recommendation**: Start with MongoDB Atlas (Option 1) - it's free, cloud-based, and perfect for development!

