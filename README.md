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

```sh
mkdir dhyan.ai
cd dhyan.ai
git clone https://github.com/ItsSitanshu/dhyan.ai
cd dhyan.ai/
git checkout -m backend
cd ..
mv dhyan.ai > back/
git clone https://github.com/ItsSitanshu/dhyan.ai
mv dhyan.ai > front/

# after configuring .env files on both "front" and "back
# running npm i + npm run dev in "front"
# installing all packages with pip in "back"
# dhyan.ai will be up and runnning
```