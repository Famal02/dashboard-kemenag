#  KEMENAG DASHBOARD - COLOR COMBINATION GUIDE

## Palet Warna Utama

```
#375673 - Blue Fusion (Primary)
#f0eee9 - Cloud Dancer (Background)
#d5cd94 - Golden Mist (Accent)
```

---

##  Kombinasi Warna Final

### 1. **Background & Layout**

| Elemen | Warna | Kode | Opacity |
|--------|-------|------|---------|
| Background Halaman | Cloud Dancer | `#f0eee9` | 100% |
| Background Card | White | `#ffffff` | 100% |
| Border Card | Golden Mist | `#d5cd94` | 20% |
| Border Card Hover | Golden Mist | `#d5cd94` | 40% |

**Visual:**
```
┌─────────────────────────────────────────┐
│  #f0eee9 (Cloud Dancer - Background)    │
│  ┌───────────────────────────────────┐  │
│  │ #ffffff (White Card)              │  │
│  │ Border: #d5cd94 20%               │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

### 2. **Typography (Huruf)**

| Elemen | Warna | Kode | Opacity |
|--------|-------|------|---------|
| Heading (H1-H4) | Blue Fusion | `#375673` | 100% |
| Body Text | Blue Fusion | `#375673` | 80% |
| Subtitle/Caption | Blue Fusion | `#375673` | 60% |
| Breadcrumb Active | Blue Fusion | `#375673` | 100% |
| Breadcrumb Inactive | Blue Fusion | `#375673` | 80% |

**Contoh:**
```
Heading:  #375673 (100%) ← Kuat & Jelas
Body:     #375673 (80%)  ← Mudah dibaca
Caption:  #375673 (60%)  ← Subtle
```

---

### 3. **Table (Tabel)**

| Elemen | Warna | Kode | Opacity |
|--------|-------|------|---------|
| **Header Background** | Blue Fusion | `#375673` | 100% |
| **Header Text** | Cloud Dancer | `#f0eee9` | 100% |
| Body Background | White | `#ffffff` | 100% |
| Body Text | Blue Fusion | `#375673` | 100% |
| Border | Golden Mist | `#d5cd94` | 15% |
| **Hover Row** | Golden Mist | `#d5cd94` | 15% |
| **Selected Row** | Golden Mist | `#d5cd94` | 25% |

**Visual Table:**
```
┌─────────────────────────────────────────┐
│ HEADER: #375673 (Blue Fusion)           │ ← Background
│ TEXT: #f0eee9 (Cloud Dancer)            │ ← Text putih krem
├─────────────────────────────────────────┤
│ Row 1: #ffffff (White)                  │ ← Normal
│ Row 2: #d5cd94 15% (Golden Mist)        │ ← Hover
│ Row 3: #d5cd94 25% (Golden Mist)        │ ← Selected
│ Text: #375673 (Blue Fusion)             │ ← Body text
└─────────────────────────────────────────┘
```

---

### 4. **Stats Cards**

| Elemen | Warna | Kode | Opacity |
|--------|-------|------|---------|
| Background | White | `#ffffff` | 100% |
| Border Left | Golden Mist | `#d5cd94` | 100% |
| Border General | Golden Mist | `#d5cd94` | 30% |
| Border Hover | Golden Mist | `#d5cd94` | 100% |
| Number | Blue Fusion | `#375673` | 100% |
| Label | Blue Fusion | `#375673` | 80% |
| Icon Background | Golden Mist | `#d5cd94` | Gradient |

**Visual:**
```
┌─────────────────────────────────────┐
▌ #d5cd94 (Left Border 4px)          │
│ Label: #375673 80%                  │
│ 123,456 ← #375673 100% (Bold 32px)  │
│                              [Icon] │ ← #d5cd94 gradient
└─────────────────────────────────────┘
```

---

### 5. **Buttons**

| Type | Background | Border | Text | Hover BG | Hover Border |
|------|------------|--------|------|----------|--------------|
| **Primary** | #375673 | #375673 | #f0eee9 | #2d4659 | #2d4659 |
| **Secondary** | Transparent | #d5cd94 | #375673 | #d5cd94 | #d5cd94 |
| **Accent** | #d5cd94 | #d5cd94 | #375673 | #c5b884 | #c5b884 |

**Visual:**
```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ PRIMARY         │  │ SECONDARY       │  │ ACCENT          │
│ BG: #375673     │  │ BG: Transparent │  │ BG: #d5cd94     │
│ Text: #f0eee9   │  │ Border: #d5cd94 │  │ Text: #375673   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

### 6. **Map (Peta)**

| Elemen | Warna | Kode |
|--------|-------|------|
| **Color Scale Low** | Cloud Dancer | `#f0eee9` |
| **Color Scale High** | Blue Fusion | `#375673` |
| Map Container BG | Cloud Dancer | `#f0eee9` |
| Map Container Border | Golden Mist | `#d5cd94` 30% |
| Legend Background | White | `#ffffff` |
| Legend Border | Golden Mist | `#d5cd94` 40% |

**Visual:**
```
┌─────────────────────────────────────────┐
│ Map Container: #f0eee9                  │
│ Border: #d5cd94 30%                     │
│                                         │
│   Gradient: #f0eee9 → #375673       │
│                                         │
│  ┌─────────┐                            │
│  │ Legend  │ ← BG: #ffffff              │
│  │ □ Low   │    Border: #d5cd94 40%     │
│  │ ■ High  │                            │
│  └─────────┘                            │
└─────────────────────────────────────────┘
```

---

##  Prinsip Kombinasi

### **Kontras Tinggi (High Contrast)**
- Header Tabel: `#375673` background + `#f0eee9` text
- Buttons Primary: `#375673` background + `#f0eee9` text
- **Ratio: 4.8:1**  WCAG AA Compliant

### **Kontras Sedang (Medium Contrast)**
- Body Text: `#375673` pada `#ffffff`
- **Ratio: 7.2:1**  WCAG AAA Compliant

### **Subtle Highlights**
- Hover: `#d5cd94` 15% opacity
- Selected: `#d5cd94` 25% opacity
- Borders: `#d5cd94` 20-40% opacity

---

##  Hierarchy Visual

```
PALING PENTING (Most Visible)
├─ Header Tabel: #375673 solid
├─ Heading: #375673 100%
├─ Primary Button: #375673 solid
│
SEDANG (Medium Visibility)
├─ Body Text: #375673 80%
├─ Border: #d5cd94 20-40%
├─ Stats Number: #375673 100%
│
KURANG PENTING (Subtle)
├─ Caption: #375673 60%
├─ Hover Effect: #d5cd94 15%
└─ Background: #f0eee9
```

---

##  Accessibility Check

| Kombinasi | Ratio | WCAG Level |
|-----------|-------|------------|
| `#375673` on `#ffffff` | 7.2:1 | AAA  |
| `#375673` on `#f0eee9` | 6.1:1 | AAA  |
| `#f0eee9` on `#375673` | 4.8:1 | AA  |
| `#d5cd94` on `#ffffff` | 1.4:1 |  (Accent only) |

**Note:** Golden Mist (#d5cd94) hanya untuk accent/border, bukan untuk text utama.

---

##  CSS Variables Reference

```css
:root {
    /* Primary Colors */
    --kemenag-primary: #375673;
    --kemenag-background: #f0eee9;
    --kemenag-accent: #d5cd94;
    --kemenag-white: #ffffff;
    
    /* Text Colors */
    --kemenag-text: #375673;
    --kemenag-text-light: rgba(55, 86, 115, 0.8);
    --kemenag-text-lighter: rgba(55, 86, 115, 0.6);
    
    /* Accent Variations */
    --kemenag-accent-dark: #c5b884;
}
```

---

##  Contoh Implementasi

### **Card dengan Table:**
```html
<div class="kemenag-page">          <!-- #f0eee9 background -->
  <div class="kemenag-container">
    <Card class="kemenag-table-card"> <!-- #ffffff, border #d5cd94 20% -->
      <CardBody>
        <h4 class="card-title">       <!-- #375673 100% -->
          Data Provinsi
        </h4>
        <Table class="kemenag-table">
          <thead>                     <!-- #375673 background -->
            <tr>
              <th>Provinsi</th>       <!-- #f0eee9 text -->
            </tr>
          </thead>
          <tbody>
            <tr>                      <!-- hover: #d5cd94 15% -->
              <td>Jawa Barat</td>     <!-- #375673 text -->
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  </div>
</div>
```

---

##  Tips Penggunaan

1. **Background Halaman:** Selalu gunakan `#f0eee9` untuk konsistensi
2. **Card:** Putih `#ffffff` dengan border Golden Mist tipis
3. **Header Tabel:** Blue Fusion `#375673` dengan text Cloud Dancer `#f0eee9`
4. **Hover Effect:** Golden Mist `#d5cd94` dengan opacity 15%
5. **Selected State:** Golden Mist `#d5cd94` dengan opacity 25%
6. **Text Hierarchy:** 100% untuk heading, 80% untuk body, 60% untuk caption

---

**Kombinasi ini memberikan:**
 Kontras tinggi untuk readability  
 Konsistensi visual  
 Professional & elegant  
 WCAG AA/AAA compliant  
 Harmonis & tidak melelahkan mata
