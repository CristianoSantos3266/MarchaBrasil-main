# 🇧🇷 Image Guide for Civic Mobilization Platform

## 🎯 What Images We Need

### **Hero Section Images**
- **Large crowds in peaceful demonstrations** (Brazil preferred)
- **Brazilian flag with people** 
- **Aerial shots of civic gatherings**
- **People in yellow/green shirts**

### **Protest Cards**
- **Regional Brazilian landscapes**
- **Civic symbols and monuments**
- **People holding signs peacefully**
- **Brazilian constitutional imagery**

### **Background Patterns**
- **Subtle Brazilian flag colors**
- **Constitutional text overlays**
- **Geometric patterns in green/yellow/blue**

## 📸 Free Image Sources

### **1. Unsplash (Best Quality)**
Search terms:
- "brazil protest democracy"
- "brazilian flag crowd"
- "peaceful demonstration"
- "civic engagement"
- "democracy crowd"

Direct links for Brazilian civic content:
```
https://unsplash.com/s/photos/brazil-democracy
https://unsplash.com/s/photos/peaceful-protest
https://unsplash.com/s/photos/brazilian-flag
```

### **2. Pexels**
Search terms in Portuguese:
- "manifestação pacífica"
- "democracia brasil"
- "bandeira brasileira"
- "cidadania"

### **3. Government Sources (Public Domain)**
- **Agência Brasil**: https://agenciabrasil.ebc.com.br/
- **Portal do Governo**: Images of civic events
- **Senado Federal**: Constitutional imagery

### **4. Creative Commons**
- **Wikimedia Commons**: Brazilian civic events
- **Flickr Creative Commons**: Search "brazil democracy"

## 🎨 AI Image Generation Prompts

### **For DALL-E/Midjourney:**
```
"Peaceful Brazilian demonstration with people in yellow and green, Brazilian flags, aerial view, democratic gathering, photorealistic"

"Brazilian citizens exercising constitutional rights, peaceful assembly, Brazilian flag colors, civic pride, sunset lighting"

"Modern Brazilian democracy, people of diverse backgrounds united, holding Brazilian flags, peaceful civic engagement"
```

## 📁 Recommended File Structure
```
public/images/
├── hero/
│   ├── brazil-democracy-1.jpg
│   ├── peaceful-protest-aerial.jpg
│   └── brazilian-flag-crowd.jpg
├── protests/
│   ├── carreata.jpg
│   ├── motociata.jpg
│   └── marcha.jpg
├── backgrounds/
│   ├── constitution-bg.jpg
│   └── flag-pattern.svg
└── icons/
    ├── truck-icon.svg
    └── motorcycle-icon.svg
```

## 🔄 How to Implement

### **Option 1: Download and Store**
1. Download images from Unsplash/Pexels
2. Optimize with tools like TinyPNG
3. Store in `public/images/`
4. Update CSS classes

### **Option 2: CDN Links**
1. Use direct Unsplash URLs (already implemented)
2. Add fallback images
3. Optimize loading with Next.js Image component

### **Option 3: Purchase Stock**
If budget allows:
- **Shutterstock**: Brazilian civic content
- **Getty Images**: High-quality political imagery
- **Adobe Stock**: Democratic themes

## 🎨 Current Implementation

We're using Unsplash URLs with Brazilian flag overlay:
```css
.hero-bg-1 {
  background-image: 
    linear-gradient(rgba(0, 128, 0, 0.7), rgba(255, 215, 0, 0.7), rgba(0, 39, 118, 0.7)),
    url('https://images.unsplash.com/photo-1557804506-669a67965ba0...');
}
```

## 🚀 Next Steps

1. **Browse Unsplash** for 5-10 perfect images
2. **Download and optimize** for web
3. **Replace CDN URLs** with local files
4. **Add Next.js Image component** for performance
5. **Create custom illustrations** if needed

## 📝 Attribution

Remember to:
- Credit photographers when required
- Check licenses for commercial use
- Keep attribution file for legal compliance