# 🖼️ VEXUS Image Migration & Port Plan

## 📋 **Complete Image Inventory by Page**

### **🏠 index.astro → src/app/page.tsx**
**Purpose:** Homepage with project gallery, shop section, mission content

**Images Required:**
```
Current Path → React Path
/images/noun-atlas-1479193-453E3E.png → public/images/icons/atlas-icon.png
/images/noun-literature-4460602-453E3E.png → public/images/icons/literature-icon.png
/images/noun-nerve-4666605-453E3E.png → public/images/icons/nerve-icon.png
/images/noun-video-review-4806914-453E3E.png → public/images/icons/video-review-icon.png
/images/the-pocus-atlas-logo.png → public/images/logos/pocus-atlas-logo.png
/images/The-POCUS-ATLAS-110.jpg → public/images/projects/pocus-atlas-jr.jpg
/images/noun-apps-914827-453E3E.jpg → public/images/icons/apps-icon.jpg
/images/IMG_2864_LR-1.jpg → public/images/courses/san-diego-course.jpg
/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-647a91c607f51.jpg → public/images/products/pocus-life-dark-tshirt.jpg
/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-647a921f84b40.jpg → public/images/products/pocus-life-light-tshirt.jpg
/images/unisex-tri-blend-t-shirt-charcoal-black-triblend-front-614d330957412.jpg → public/images/products/pocus-atlas-cream-tshirt.jpg
/images/unisex-tri-blend-t-shirt-oatmeal-triblend-front-602eb4adeeb2f.jpg → public/images/products/sonophile-tshirt.jpg
/images/ceramic-mug-15oz-white-647a93493685c.jpg → public/images/products/pocus-atlas-mug.jpg
```

**React Components to Create:**
- `HeroSection.tsx` - Main banner
- `ProjectsGallery.tsx` - 4-icon gallery grid
- `ProductCarousel.tsx` - Shop product carousel
- `MissionVideoSection.tsx` - YouTube embed

---

### **📊 calculator.astro → src/app/calculator/page.tsx**
**Purpose:** AI image recognition calculator with 4-step workflow

**Images Required:**
```
Current Path → React Path
[No direct images - uses uploaded user images and icons]
/images/favicon.ico → public/favicon.ico (global)
```

**React Components to Create:**
- `CalculatorForm.tsx` - Main stepper form
- `ImageUploadStep.tsx` - File upload with crop
- `ModalPredictionStep.tsx` - AI analysis display
- `ResultsDisplayStep.tsx` - VEXUS score results
- `IVCSelectionStep.tsx` - IVC diameter selection

**Critical Modal Workflow:**
```
1. ImageUploadStep → handles file selection
2. ImageCropStep → crop to waveform area  
3. ModalPredictionStep → send to Modal.run AI
4. ResultsDisplayStep → show predictions
```

---

### **🎓 education.astro → src/app/education/page.tsx**
**Purpose:** VEXUS learning materials and diagrams

**Images Required:**
```
Current Path → React Path
/images/organ perfusion.png → public/images/education/organ-perfusion-diagram.png
/images/veuxus_congestion.png → public/images/education/venous-congestion-patterns.png
/images/VEXUS_Overview.png → public/images/education/vexus-overview-diagram.png
```

**React Components to Create:**
- `EducationLayout.tsx` - Learning page structure
- `ConceptDiagram.tsx` - Interactive diagrams
- `LearningSection.tsx` - Content sections
- `ReferenceGrid.tsx` - Scientific references

---

### **📸 acquisition.astro → src/app/acquisition/page.tsx**
**Purpose:** Image acquisition techniques guide

**Images Required:**
```
Current Path → React Path
/images/IVC.png → public/images/acquisition/ivc-assessment.png
/images/Hepatic.long.gif → public/images/acquisition/gifs/hepatic-long-axis.gif
/images/IVC_RUQ.png → public/images/acquisition/ivc-ruq-view.png
/images/hepatic_long.png → public/images/acquisition/hepatic-long-axis.png
/images/hepatic_short.png → public/images/acquisition/hepatic-short-axis.png
/images/hepatic_sub.png → public/images/acquisition/hepatic-subxiphoid.png
/images/Portalvein.subxi.gif → public/images/acquisition/gifs/portal-subxiphoid.gif
/images/Portal_long_axis.png → public/images/acquisition/portal-long-axis.png
/images/Portal.long.gif → public/images/acquisition/gifs/portal-long-axis.gif
/images/Portal_short_axis.png → public/images/acquisition/portal-short-axis.png
/images/Portal_sub.png → public/images/acquisition/portal-subxiphoid.png
/images/Renal_vein_long.png → public/images/acquisition/renal-long-axis.png
/images/renal.long.still.png → public/images/acquisition/renal-long-still.png
/images/Renal.short.gif → public/images/acquisition/gifs/renal-short-axis.gif
/images/Renal_short_axis.png → public/images/acquisition/renal-short-axis.png
```

**React Components to Create:**
- `AcquisitionGuide.tsx` - Main guide layout
- `VeinCategorySection.tsx` - IVC/Hepatic/Portal/Renal sections
- `TechniqueCard.tsx` - Individual acquisition technique
- `ImageViewer.tsx` - Fancybox-style image modal

---

### **🌊 waveform.astro → src/app/waveform/page.tsx**
**Purpose:** Doppler waveform interpretation guide

**Images Required:**
```
Current Path → React Path
/images/EKGtracing.hepatic.png → public/images/waveforms/ekg-hepatic-tracing.png
/images/hepaticvein.normal.asvd.png → public/images/waveforms/hepatic-normal-asvd.png
/images/Hepatic.asvd.normal.2.png → public/images/waveforms/hepatic-normal-pattern.png
/images/hepatic.mild.png → public/images/waveforms/hepatic-mild-congestion.png
/images/Hepatic.SR.SD.png → public/images/waveforms/hepatic-severe-reversal.png
/images/portal.normal.png → public/images/waveforms/portal-normal-flow.png
/images/portal.mild.png → public/images/waveforms/portal-mild-pulsatile.png
/images/portal.severe.png → public/images/waveforms/portal-severe-pulsatile.png
/images/renal.normal.png → public/images/waveforms/renal-normal-continuous.png
/images/renal.mild.png → public/images/waveforms/renal-mild-biphasic.png
/images/renal.severe.png → public/images/waveforms/renal-severe-monophasic.png
/images/VExUS.grading.png → public/images/waveforms/vexus-grading-system.png
```

**React Components to Create:**
- `WaveformGuide.tsx` - Main interpretation guide
- `WaveformSection.tsx` - Hepatic/Portal/Renal sections
- `WaveformPattern.tsx` - Individual pattern examples
- `GradingSystemCard.tsx` - VEXUS grading explanation

---

### **👥 team.astro → src/app/team/page.tsx**
**Purpose:** Team member profiles and photos

**Images Required:**
```
Current Path → React Path
/images/August Longino.jpg → public/images/team/august-longino.jpg
/images/gabe siegel.jpg → public/images/team/gabriel-siegel.jpg
/images/Riscinti Matthew D.jpg → public/images/team/matthew-riscinti.jpg
/images/ED Gill.jpg → public/images/team/ed-gill.jpg
/images/IVOR.jpg → public/images/team/ivor-douglas.jpg
/images/NN headshot.jpg → public/images/team/nhu-nguyen-le.jpg
/images/Milgrim headshot.jpg → public/images/team/fred-milgrim.jpg
/images/Alsharif headshot.jpg → public/images/team/peter-alsharif.jpg
/images/luke-mccormack-headshot.jpg → public/images/team/luke-mccormack.jpg
/images/kthayapran-headshot.png → public/images/team/kisha-thayapran.png
```

**React Components to Create:**
- `TeamLayout.tsx` - Team page structure
- `TeamGrid.tsx` - Member grid layout
- `TeamMemberCard.tsx` - Individual member cards
- `TeamSection.tsx` - Core team vs contributors

---

### **🖼️ image-atlas.astro → src/app/image-atlas/page.tsx**
**Purpose:** Interactive image gallery with filtering

**Images Required:**
```
Current Path → React Path
/images/VEXUS.ATLAS.png → public/images/logos/vexus-atlas-logo.png
/images/favicon.ico → public/favicon.ico
/images/apple-touch-icon.png → public/apple-touch-icon.png
[Plus: Dynamic images from Airtable API]
```

**React Components to Create:**
- `ImageAtlas.tsx` - Main gallery interface
- `GalleryFilters.tsx` - Search and filter system
- `GalleryGrid.tsx` - Responsive image grid
- `ImageModal.tsx` - Full-screen image viewer
- `CategorySection.tsx` - Hepatic/Portal/Renal categories

---

### **📧 contact.astro → src/app/contact/page.tsx**
**Purpose:** Contact form and information

**Images Required:**
```
Current Path → React Path
[No images - form-based page]
```

**React Components to Create:**
- `ContactLayout.tsx` - Contact page structure
- `ContactForm.tsx` - Main contact form
- `ContactMethods.tsx` - Alternative contact options
- `FileUpload.tsx` - Attachment handling

---

### **ℹ️ about.astro → src/app/about/page.tsx**
**Purpose:** About VEXUS ATLAS information

**Images Required:**
```
Current Path → React Path
[No images - text-based content]
```

**React Components to Create:**
- `AboutLayout.tsx` - About page structure
- `MissionSection.tsx` - Mission statement
- `AboutCard.tsx` - Content cards

---

### **📚 literature.astro → src/app/literature-review/page.tsx**
**Purpose:** Literature review and references

**Images Required:**
```
Current Path → React Path
[No images - text-based academic content]
```

**React Components to Create:**
- `LiteratureLayout.tsx` - Literature page structure
- `PaperCard.tsx` - Individual paper cards
- `ReferenceSection.tsx` - Academic references

---

### **📄 publications.astro → src/app/publications/page.tsx**
**Purpose:** Team publications and papers

**Images Required:**
```
Current Path → React Path
[No images - text-based academic content]
```

**React Components to Create:**
- `PublicationsLayout.tsx` - Publications structure
- `PublicationCard.tsx` - Individual publication cards
- `PublicationFilters.tsx` - Filter by year/type

---

## 📁 **React Public Directory Structure**

```
public/
├── 📁 images/
│   ├── 📁 logos/
│   │   ├── 📄 vexus-atlas-logo.png
│   │   └── 📄 pocus-atlas-logo.png
│   ├── 📁 icons/
│   │   ├── 📄 atlas-icon.png
│   │   ├── 📄 literature-icon.png
│   │   ├── 📄 nerve-icon.png
│   │   ├── 📄 video-review-icon.png
│   │   └── 📄 apps-icon.jpg
│   ├── 📁 team/
│   │   ├── 📄 august-longino.jpg
│   │   ├── 📄 gabriel-siegel.jpg
│   │   ├── 📄 matthew-riscinti.jpg
│   │   ├── 📄 ed-gill.jpg
│   │   ├── 📄 ivor-douglas.jpg
│   │   ├── 📄 nhu-nguyen-le.jpg
│   │   ├── 📄 fred-milgrim.jpg
│   │   ├── 📄 peter-alsharif.jpg
│   │   ├── 📄 luke-mccormack.jpg
│   │   └── 📄 kisha-thayapran.png
│   ├── 📁 products/
│   │   ├── 📄 pocus-life-dark-tshirt.jpg
│   │   ├── 📄 pocus-life-light-tshirt.jpg
│   │   ├── 📄 pocus-atlas-cream-tshirt.jpg
│   │   ├── 📄 sonophile-tshirt.jpg
│   │   └── 📄 pocus-atlas-mug.jpg
│   ├── 📁 education/
│   │   ├── 📄 organ-perfusion-diagram.png
│   │   ├── 📄 venous-congestion-patterns.png
│   │   └── 📄 vexus-overview-diagram.png
│   ├── 📁 acquisition/
│   │   ├── 📄 ivc-assessment.png
│   │   ├── 📄 ivc-ruq-view.png
│   │   ├── 📄 hepatic-long-axis.png
│   │   ├── 📄 hepatic-short-axis.png
│   │   ├── 📄 hepatic-subxiphoid.png
│   │   ├── 📄 portal-long-axis.png
│   │   ├── 📄 portal-short-axis.png
│   │   ├── 📄 portal-subxiphoid.png
│   │   ├── 📄 renal-long-axis.png
│   │   ├── 📄 renal-long-still.png
│   │   ├── 📄 renal-short-axis.png
│   │   └── 📁 gifs/
│   │       ├── 📄 hepatic-long-axis.gif
│   │       ├── 📄 portal-subxiphoid.gif
│   │       ├── 📄 portal-long-axis.gif
│   │       └── 📄 renal-short-axis.gif
│   ├── 📁 waveforms/
│   │   ├── 📄 ekg-hepatic-tracing.png
│   │   ├── 📄 hepatic-normal-asvd.png
│   │   ├── 📄 hepatic-normal-pattern.png
│   │   ├── 📄 hepatic-mild-congestion.png
│   │   ├── 📄 hepatic-severe-reversal.png
│   │   ├── 📄 portal-normal-flow.png
│   │   ├── 📄 portal-mild-pulsatile.png
│   │   ├── 📄 portal-severe-pulsatile.png
│   │   ├── 📄 renal-normal-continuous.png
│   │   ├── 📄 renal-mild-biphasic.png
│   │   ├── 📄 renal-severe-monophasic.png
│   │   └── 📄 vexus-grading-system.png
│   ├── 📁 projects/
│   │   └── 📄 pocus-atlas-jr.jpg
│   └── 📁 courses/
│       └── 📄 san-diego-course.jpg
├── 📄 favicon.ico
├── 📄 apple-touch-icon.png
├── 📄 robots.txt
└── 📄 sitemap.xml
```

---

## 🚀 **Migration Commands**

### **Automated Copy Script:**
```bash
# Create React image directory structure
mkdir -p "REACT VEXUS/public/images/{logos,icons,team,products,education,acquisition,waveforms,projects,courses}"
mkdir -p "REACT VEXUS/public/images/acquisition/gifs"

# Copy and rename images systematically
# Icons
cp "vexus-astro-new copy/public/images/noun-atlas-1479193-453E3E.png" "REACT VEXUS/public/images/icons/atlas-icon.png"
cp "vexus-astro-new copy/public/images/noun-literature-4460602-453E3E.png" "REACT VEXUS/public/images/icons/literature-icon.png"
cp "vexus-astro-new copy/public/images/noun-nerve-4666605-453E3E.png" "REACT VEXUS/public/images/icons/nerve-icon.png"
cp "vexus-astro-new copy/public/images/noun-video-review-4806914-453E3E.png" "REACT VEXUS/public/images/icons/video-review-icon.png"
cp "vexus-astro-new copy/public/images/noun-apps-914827-453E3E.jpg" "REACT VEXUS/public/images/icons/apps-icon.jpg"

# Logos
cp "vexus-astro-new copy/public/images/VEXUS.ATLAS.png" "REACT VEXUS/public/images/logos/vexus-atlas-logo.png"
cp "vexus-astro-new copy/public/images/the-pocus-atlas-logo.png" "REACT VEXUS/public/images/logos/pocus-atlas-logo.png"

# Team photos
cp "vexus-astro-new copy/public/images/August Longino.jpg" "REACT VEXUS/public/images/team/august-longino.jpg"
cp "vexus-astro-new copy/public/images/gabe siegel.jpg" "REACT VEXUS/public/images/team/gabriel-siegel.jpg"
# ... continue for all team photos

# Education diagrams
cp "vexus-astro-new copy/public/images/organ perfusion.png" "REACT VEXUS/public/images/education/organ-perfusion-diagram.png"
cp "vexus-astro-new copy/public/images/veuxus_congestion.png" "REACT VEXUS/public/images/education/venous-congestion-patterns.png"
cp "vexus-astro-new copy/public/images/VEXUS_Overview.png" "REACT VEXUS/public/images/education/vexus-overview-diagram.png"

# Waveform images
cp "vexus-astro-new copy/public/images/EKGtracing.hepatic.png" "REACT VEXUS/public/images/waveforms/ekg-hepatic-tracing.png"
# ... continue for all waveform images

# Global assets
cp "vexus-astro-new copy/public/images/favicon.ico" "REACT VEXUS/public/favicon.ico"
```

---

## 📋 **Conversion Priority by Page**

### **Priority 1: Critical Functionality (Week 1-2)**
1. **calculator.astro** → `CalculatorForm.tsx` 
   - **MOST CRITICAL** - Modal image workflow
   - AI integration endpoints
   - Multi-step form logic

2. **index.astro** → `HomePage.tsx`
   - Homepage with hero section
   - Project gallery grid
   - Shop carousel

### **Priority 2: Core Content (Week 3-4)**
3. **image-atlas.astro** → `ImageAtlas.tsx`
   - Airtable integration
   - Gallery filtering system
   - Responsive grid layout

4. **education.astro** → `EducationPage.tsx`
   - Learning content sections
   - Interactive diagrams

### **Priority 3: Reference Content (Week 5-6)**
5. **waveform.astro** → `WaveformGuide.tsx`
   - Waveform interpretation guide
   - Image modal viewer

6. **acquisition.astro** → `AcquisitionGuide.tsx`
   - Technical imaging guide
   - GIF animations support

7. **team.astro** → `TeamPage.tsx`
   - Team member profiles
   - Responsive photo grid

### **Priority 4: Supporting Pages (Week 7)**
8. **about.astro** → `AboutPage.tsx`
9. **contact.astro** → `ContactPage.tsx`
10. **literature.astro** → `LiteratureReview.tsx`
11. **publications.astro** → `PublicationsPage.tsx`

---

## ⚠️ **Critical Image Migration Notes**

### **Missing Images to Source:**
- `ceramic-mug-15oz-white-647a93493685c.jpg` - Not found in current directory
- Some team photos may need higher resolution versions
- GIF files need testing for React compatibility

### **Image Optimization Requirements:**
- Convert large JPGs to WebP format for performance
- Generate responsive image variants (thumbnails, mobile, desktop)
- Optimize GIF files for web delivery
- Add alt text for accessibility

### **Path Migration in Components:**
```typescript
// Old Astro path
<img src="/images/VEXUS.ATLAS.png" alt="VEXUS ATLAS Logo" />

// New React path with Next.js Image optimization
import Image from 'next/image'
<Image 
  src="/images/logos/vexus-atlas-logo.png" 
  alt="VEXUS ATLAS Logo"
  width={200}
  height={100}
  priority={true}
/>
```

This comprehensive plan ensures all images are properly migrated and organized for the React conversion! 🎯 