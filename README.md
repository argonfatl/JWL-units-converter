# Biblical Units Converter

An Obsidian plugin that automatically converts biblical units of measurement to modern equivalents with monetary value estimates.

## Description

Biblical Units Converter helps Bible readers better understand ancient units of measurement by automatically converting them to modern metric units. The plugin supports units of length, weight, volume, time, and **monetary units** used in biblical times, with modern economic equivalents based on historical wage data.

## ✨ Key Features

- 🔄 **Automatic conversion** of biblical units to modern equivalents
- 💰 **Monetary equivalents** showing modern value of ancient coins
- 🌍 **Multilingual support** (Russian, English, Spanish)
- 📅 **Hebrew calendar** information with agricultural and religious events
- ⚙️ **Flexible formatting** options (parentheses, inline, callout, replace)
- 🎯 **Selective conversion** with customizable unit types
- 📝 **Context menu integration** for easy access

## Supported Units of Measurement

### Length Units
- **Finger/Палец** (0.0185 m) - width of a finger
- **Handbreadth/Ладонь** (0.074 m) - width of four fingers
- **Span/Пядь** (0.222 m) - distance from thumb to little finger
- **Cubit/Локоть** (0.445 m) - main unit of length in antiquity
- **Long Cubit/Длинный локоть** (0.518 m) - extended cubit
- **Reed/Трость** (2.67 m) - measuring rod
- **Fathom/Сажень** (1.8 m) - distance between outstretched arms
- **Stadium/Стадий** (185 m) - Greek unit of length
- **Mile/Поприще** (1480 m) - Roman mile

### Weight & Monetary Units
#### Hebrew System
- **Gerah/Гера** (0.57 g) - 1/20 shekel
- **Bekah/Бека** (5.7 g) - 1/2 shekel
- **Pim/Пим** (7.8 g) - 2/3 shekel
- **Shekel/Шекель** (11.4 g) - main unit of weight ≈ 0.5 work days ≈ $25
- **Mina/Мина** (570 g) - 50 shekels ≈ 4 months salary ≈ $6,100
- **Talent/Талант** (34.2 kg) - 60 minas ≈ **20 years salary** ≈ **$365,000**

#### Greek & Roman System
- **Lepton/Лепта** (0.34 g) - smallest coin
- **Quadrans/Кодрант** (0.68 g) - Roman copper coin
- **Denarius/Динарий** (3.85 g) - 1 day's wage ≈ $50
- **Drachma/Драхма** (3.4 g) - 1 day's wage ≈ $45
- **Didrachma/Дидрахма** (6.8 g) - 2 days' wage ≈ $90
- **Tetradrachma/Тетрадрахма** (13.6 g) - 4 days' wage ≈ $180
- **Greek Mina/Мина греческая** (340 g) - ~100 days' wage ≈ $5,000
- **Greek Talent/Талант греческий** (20.4 kg) - ~20 years' wage ≈ $365,000

### Volume Units
#### Liquid Measures
- **Log/Лог** (0.31 l) - smallest liquid measure
- **Hin/Гин** (3.67 l) - 1/6 bath
- **Bath/Бат** (22 l) - standard liquid measure
- **Cor/Кор** (220 l) - largest liquid measure

#### Dry Measures
- **Choenix/Хиникс** (1.08 l) - daily grain ration
- **Cab/Каб** (1.22 l) - small dry measure
- **Omer/Гомор** (2.2 l) - daily bread portion
- **Seah/Сата** (7.33 l) - 1/3 ephah
- **Ephah/Ефа** (22 l) - standard dry measure
- **Homer/Хомер** (220 l) - largest dry measure

### Time Units
- **Watch/Стража** (3 h) - night watch period
- **Hour/Час** (1 h) - daytime hour
- **Day/День**, **Week/Неделя**, **Month/Месяц**, **Year/Год**

## 📥 Installation

1. Copy the plugin folder to the `.obsidian/plugins/` directory of your vault
2. Restart Obsidian
3. Enable the plugin in Community plugins settings

## 🚀 Usage

### Basic Conversion
Simply type biblical units in your notes and convert them:

**Input:** `1 talent of silver`
**Output:** `1 talent of silver (34.20 kg ≈ 20 years salary = $50×7300 ≈ 365,000 dollars (silver))`

**Input:** `5 cubits`
**Output:** `5 cubits (2.22 m)`

### Commands
- **Convert Selected Units** - Convert units in selected text
- **Convert All Units in Document** - Convert all units in the entire document
- **Find and Convert** - Search and convert with specific settings
- **Month Information** - Get Hebrew calendar details

### Context Menu
Right-click on selected text to access:
- 🔄 **Convert** - Standard conversion
- 📋 **Convert in Callout** - Format as Obsidian callout
- 🔍 **Find and Convert** - Bulk conversion with custom settings
- 📅 **Month Information** - Hebrew calendar details

### Output Formats
1. **Parentheses**: `1 cubit (0.44 m)`
2. **Inline**: `1 cubit = 0.44 m`
3. **Replace**: `0.44 m`
4. **Callout**: 
   ```
   > [!convert] Units of Measurement
   > **1 cubit = 0.44 m**
   ```

### Hebrew Calendar
Convert Hebrew month names to get detailed information:

**Input:** `nisan`
**Output:**
```
> [!convert] Month - NISAN (ABIB) - (March—April)
> **Events**
> **14** Passover
> **15-21** Unleavened Bread
> **16** Offering of firstfruits
> **Weather**
> Jordan swells from rains, melting snow
> **Crops/Activity**
> Barley
```

## ⚙️ Settings

### Language Support
- **English** - Default
- **Russian** (Русский) - Full translation
- **Spanish** (Español) - Complete localization

### Conversion Options
- **Enable/disable** specific unit types (length, weight, volume, time)
- **Precision control** (0-5 decimal places)
- **Bold formatting** for converted values
- **Monetary equivalents** toggle
- **Separate settings** for "Find and Convert" function

### Monetary Equivalents
When enabled, ancient coins show modern economic value:
- **Customizable daily wage** - set your own daily wage for calculations
- **Transparent formula** - shows calculation: `$50×7300 = $365,000`
- Based on historical daily wages (work days equivalent)
- Accounts for silver/gold content
- Multilingual formatting

## 📊 Data Sources

All conversion data is based on:
- **JW.ORG** official biblical units reference
- Archaeological findings and historical research
- Ancient wage and economic data
- Modern silver/gold market values

## 🌍 Multilingual Examples

### Russian
`1 талант (34.20 кг ≈ 20 лет зарплаты = $50×7300 ≈ 365,000 долларов (серебро))`

### English  
`1 talent (34.20 kg ≈ 20 years salary = $50×7300 ≈ 365,000 dollars (silver))`

### Spanish
`1 talento (34.20 kg ≈ 20 años de salario = $50×7300 ≈ 365,000 dólares (plata))`

## 🔧 Technical Details

### Supported Variants
The plugin recognizes multiple forms of each unit:
- **Russian**: Handles all grammatical cases (локоть, локтя, локтей)
- **English**: Singular and plural forms (cubit, cubits)
- **Spanish**: Gender and number variations (codo, codos)

### Regex Pattern Matching
- Supports both regular spaces and non-breaking spaces
- Handles decimal numbers with both dots and commas
- Case-insensitive matching
- Escapes special regex characters in unit names

## 📝 License

This plugin is released under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📚 References

- [JW.ORG Biblical Units Reference](https://wol.jw.org/en/wol/d/r1/lp-e/1001070236)
- Archaeological and historical research on ancient measurements
- Biblical scholarship on ancient economic systems

---

**Made with ❤️ for Bible study and research**
