![logo](__github__/logo.svg)
# Dhyan.AI


Students in Nepal, especially those in high school level studies, face several challenges:
- Fragmented study materials make it difficult to find reliable and comprehensive resources.
- Lack of personalized learning support hinders students from getting the guidance they need.
- Difficulty in understanding complex topics due to ineffective teaching methods.
- Traditional learning methods may not cater to diverse learning needs.
- Inefficient study habits result in lower academic performance.

### **Solution Statement:**  
Dhyan.AI is an AI-powered learning platform designed to support high school students in Nepal by addressing their study challenges through intelligent and interactive learning solutions.  

#### **Tech Stack:**  
- **Frontend:** Next.js + React
- **Backend:** Python (for AI/ML models) and Supabase (for real-time database & authentication)

#### **How do i locally run this?**
``` sh
# Create and navigate to the project directory
mkdir dhyan.ai
cd dhyan.ai

# Clone the repository
git clone https://github.com/ItsSitanshu/dhyan.ai

# Navigate to the cloned directory
cd dhyan.ai/

# Switch to the backend branch
git checkout backend  

# Go back to the parent directory
cd ..

# Rename the first clone to "back"
mv dhyan.ai back

# Clone the repository again for the frontend
git clone https://github.com/ItsSitanshu/dhyan.ai

# Rename the second clone to "front"
mv dhyan.ai front

# Configure the .env files in both "front" and "back"
echo "Configure .env files manually in 'front' and 'back' before proceeding."

# Install frontend dependencies and start the frontend
cd front
npm install
npm run dev &  # Runs in the background
cd ..

# Install backend dependencies and start the backend
cd back
pip install -r requirements.txt
# Run the backend (modify the command based on your backend framework)
# Example for Flask: 
# python app.py &  
# Example for Django:  
# python manage.py runserver &  
cd ..

echo "dhyan.ai is now up and running!"
```
