# DroneTV Design System v1.0

Source of truth for every color, typography value, component style, and spacing rule used across DroneTv.in. This is the **only** approved palette and styling reference for this project.

> **STRICT RULE:** Never introduce a color, gradient, font-weight scale, spacing value, or branding element that isn't listed here. If a new UI need doesn't fit an existing token, ask before inventing a new one — don't guess a new hex value or one-off style.

---

## 01. Primary Brand Colors
| Name | Hex | RGB |
|---|---|---|
| Primary Yellow | `#F8C400` | 248, 196, 0 |
| Secondary Yellow | `#FFD84D` | 255, 216, 77 |
| Golden Yellow | `#E8B400` | 222, 180, 0 |

## 02. Secondary Colors
| Name | Hex |
|---|---|
| Primary Black | `#111111` |
| Charcoal | `#222222` |
| Dark Gray | `#404040` |
| Medium Gray | `#6B7280` |
| Light Gray | `#E5E7EB` |
| Off White | `#FAFAFA` |
| White | `#FFFFFF` |

## 03. Background Colors
| Name | Hex | Notes |
|---|---|---|
| Main Background | `#FFF8D6` | Light Yellow |
| Section Alternate | `#FFF3B0` | Light Yellow |
| Card Background | `#FFFFFF` | White |
| Premium Card | `#1C1C1C` | Dark |
| Dark Section | `#111111` | Dark |

## 04. Typography Colors
| Role | Hex |
|---|---|
| Main Heading | `#111111` |
| Sub Heading | `#404040` |
| Paragraph | `#666666` |
| Caption | `#8B8B8B` |
| Links (Normal) | `#C98F00` |
| Links (Hover) | `#F8C400` |

## 05. Buttons
**Primary Button** — BG `#F8C400` / Text `#111111`
- Hover: BG `#E8B400` / Text `#111111`
- Active: BG `#C98F00` / Text `#111111`

**Secondary Button** — Border `#F8C400` / Text `#F8C400`
- Hover: BG `#F8C400` / Text `#111111`
- Active: BG `#E8B400` / Text `#111111`

**Dark Button** — BG `#111111` / Text `#FFFFFF`
- Hover: BG `#222222` / Text `#FFFFFF`
- Active: BG `#000000` / Text `#FFFFFF`

## 06. Status Colors
| Status | Hex |
|---|---|
| Success | `#22C55E` |
| Warning | `#F59E0B` |
| Error | `#DC2626` |
| Information | `#2563EB` |

## 07. Badges
| Badge | BG | Text |
|---|---|---|
| Premium | `#FFF1C2` | `#A66A00` |
| Featured | `#111111` | `#F8C400` |
| New | `#22C55E` | `#FFFFFF` |

## 08. Cards
- Background: `#FFFFFF`
- Border: `#EFEFEF`
- Border Radius: `20px`
- Shadow: `0 8px 25px rgba(0,0,0,.08)`

## 09. Navigation Bar
- Background: `#F8C400`
- Menu Text: `#111111`
- Hover: `#FFFFFF`
- Active Background: `#111111`
- Active Text: `#F8C400`

## 10. Footer
- Dark (`#111111`) background, white text, yellow logo accents. Quick Links / Resources / Contact Us column layout with social icons.

## 11. Forms
- Input Background: `#FFFFFF`
- Border: `#DDDDDD`
- Focus Border: `#F8C400`
- Placeholder Text: `#999999`

## 12. Icons
- Primary: `#F8C400`
- Dark: `#111111`
- Light: `#FFFFFF`

## 13. Gradients (hero / premium / special highlights only — see usage rules)
| Name | Gradient |
|---|---|
| Hero Gradient | `#FFFBEA` → `#F8C400` |
| Premium Gradient | `#111111` → `#2A2A2A` |
| Gold Gradient | `#F8C400` → `#E8B400` |

## 14. Spacing Scale
`4px` XS · `8px` S · `16px` M · `24px` L · `32px` XL · `48px` XXL · `80px` Section Padding

## 15. Border Radius
`8px` Small · `10px` Input · `12px` Button · `16px` Card · `20px` Large Card · `24px` Pill

## 16. Real Image References
Drone/tech photography style: aerial drone shots, tech professionals at monitoring screens, industrial/agricultural drone footage, landscape/aerial survey imagery. Avoid stock imagery that doesn't match this tone.

## 17. Usage Guidelines for Developers
- Use `#F8C400` as the primary brand color for buttons, highlights, navigation, and CTAs.
- Use `#111111` for dark sections, footer, and strong emphasis.
- Maintain consistent typography, spacing, and component styles across the website.
- Use white cards with subtle shadows and `20px` border-radius for a clean, modern look.
- Follow the defined hover, active, and focus states for better UX.
- Ensure sufficient contrast for accessibility.
- Use the defined status colors for alerts, messages, and indicators.
- Use the spacing scale for margins, paddings, and layout consistency.
- Use icons from the defined icon set or matching style for visual consistency.
- Use gradients only in hero sections, premium sections, or special highlights — not everywhere.
- Maintain visual hierarchy using heading / sub-heading / paragraph / caption colors.
- Optimize images and use consistent border radius for all media.

---
*Reference: DroneTV Design System v1.0 poster (colors, typography, UI components & guidelines). Any future design-system version bump should update this file directly — do not create a parallel/duplicate spec.*
