const options = [
  { country: 'Colombia', isoCode: 'CO', code: '57' },
  { country: 'United States', isoCode: 'US', code: '1' },
  // { country: "Canada", isoCode: "CA", code: "1" },
  { country: 'Russia', isoCode: 'RU', code: '7' },
  { country: 'China', isoCode: 'CN', code: '86' },
  { country: 'India', isoCode: 'IN', code: '91' },
  { country: 'United Kingdom', isoCode: 'GB', code: '44' },
  { country: 'Germany', isoCode: 'DE', code: '49' },
  { country: 'France', isoCode: 'FR', code: '33' },
  { country: 'Australia', isoCode: 'AU', code: '61' },
  { country: 'Japan', isoCode: 'JP', code: '81' },
  { country: 'Brazil', isoCode: 'BR', code: '55' },
  { country: 'Mexico', isoCode: 'MX', code: '52' },
  { country: 'Italy', isoCode: 'IT', code: '39' },
  { country: 'South Africa', isoCode: 'ZA', code: '27' },
  { country: 'South Korea', isoCode: 'KR', code: '82' },
  { country: 'Argentina', isoCode: 'AR', code: '54' },
  { country: 'Egypt', isoCode: 'EG', code: '20' },
  { country: 'Turkey', isoCode: 'TR', code: '90' },
  { country: 'Saudi Arabia', isoCode: 'SA', code: '966' },
  { country: 'Nigeria', isoCode: 'NG', code: '234' },
  { country: 'Philippines', isoCode: 'PH', code: '63' },
  { country: 'Thailand', isoCode: 'TH', code: '66' },
  { country: 'Vietnam', isoCode: 'VN', code: '84' },
  { country: 'Indonesia', isoCode: 'ID', code: '62' },
  { country: 'Malaysia', isoCode: 'MY', code: '60' },
  { country: 'United Arab Emirates', isoCode: 'AE', code: '971' },
  { country: 'Israel', isoCode: 'IL', code: '972' },
  { country: 'Singapore', isoCode: 'SG', code: '65' },
  { country: 'New Zealand', isoCode: 'NZ', code: '64' },
  { country: 'Sweden', isoCode: 'SE', code: '46' },
  { country: 'Switzerland', isoCode: 'CH', code: '41' },
  { country: 'Netherlands', isoCode: 'NL', code: '31' },
  { country: 'Belgium', isoCode: 'BE', code: '32' },
  { country: 'Austria', isoCode: 'AT', code: '43' },
  { country: 'Greece', isoCode: 'GR', code: '30' },
  { country: 'Portugal', isoCode: 'PT', code: '351' },
  { country: 'Spain', isoCode: 'ES', code: '34' },
  { country: 'Poland', isoCode: 'PL', code: '48' },
  { country: 'Denmark', isoCode: 'DK', code: '45' },
  { country: 'Norway', isoCode: 'NO', code: '47' },
  { country: 'Finland', isoCode: 'FI', code: '358' },
  { country: 'Ireland', isoCode: 'IE', code: '353' },
  { country: 'Pakistan', isoCode: 'PK', code: '92' },
  { country: 'Bangladesh', isoCode: 'BD', code: '880' },
  { country: 'Sri Lanka', isoCode: 'LK', code: '94' },
  { country: 'Nepal', isoCode: 'NP', code: '977' },
  { country: 'Iraq', isoCode: 'IQ', code: '964' },
  { country: 'Iran', isoCode: 'IR', code: '98' },
  { country: 'Qatar', isoCode: 'QA', code: '974' },
  { country: 'Kuwait', isoCode: 'KW', code: '965' },
  { country: 'Bahrain', isoCode: 'BH', code: '973' },
  { country: 'Oman', isoCode: 'OM', code: '968' },
  { country: 'Jordan', isoCode: 'JO', code: '962' },
  { country: 'Lebanon', isoCode: 'LB', code: '961' },
  { country: 'Cyprus', isoCode: 'CY', code: '357' },
  { country: 'Iceland', isoCode: 'IS', code: '354' },
  { country: 'Luxembourg', isoCode: 'LU', code: '352' },
  { country: 'Malta', isoCode: 'MT', code: '356' },
  { country: 'Andorra', isoCode: 'AD', code: '376' },
  { country: 'Monaco', isoCode: 'MC', code: '377' },
  { country: 'Liechtenstein', isoCode: 'LI', code: '423' },
  { country: 'Vatican City', isoCode: 'VA', code: '379' },
  { country: 'San Marino', isoCode: 'SM', code: '378' },
  { country: 'North Korea', isoCode: 'KP', code: '850' },
  { country: 'Greenland', isoCode: 'GL', code: '299' },
  { country: 'Faroe Islands', isoCode: 'FO', code: '298' },
  { country: 'Estonia', isoCode: 'EE', code: '372' },
  { country: 'Latvia', isoCode: 'LV', code: '371' },
  { country: 'Lithuania', isoCode: 'LT', code: '370' },
  { country: 'Armenia', isoCode: 'AM', code: '374' },
  { country: 'Georgia', isoCode: 'GE', code: '995' },
  { country: 'Azerbaijan', isoCode: 'AZ', code: '994' },
  { country: 'Kazakhstan', isoCode: 'KZ', code: '7' },
  { country: 'Uzbekistan', isoCode: 'UZ', code: '998' },
  { country: 'Turkmenistan', isoCode: 'TM', code: '993' },
  { country: 'Kyrgyzstan', isoCode: 'KG', code: '996' },
  { country: 'Tajikistan', isoCode: 'TJ', code: '992' },
  { country: 'Mongolia', isoCode: 'MN', code: '976' },
  { country: 'Afghanistan', isoCode: 'AF', code: '93' },
  { country: 'Yemen', isoCode: 'YE', code: '967' },
  { country: 'Syria', isoCode: 'SY', code: '963' },
  { country: 'Sudan', isoCode: 'SD', code: '249' },
  { country: 'Morocco', isoCode: 'MA', code: '212' },
  { country: 'Algeria', isoCode: 'DZ', code: '213' },
  { country: 'Tunisia', isoCode: 'TN', code: '216' },
  { country: 'Libya', isoCode: 'LY', code: '218' },
  { country: 'Angola', isoCode: 'AO', code: '244' },
  { country: 'Ethiopia', isoCode: 'ET', code: '251' },
  { country: 'Kenya', isoCode: 'KE', code: '254' },
  { country: 'Ghana', isoCode: 'GH', code: '233' },
  { country: 'Ivory Coast', isoCode: 'CI', code: '225' },
  { country: 'Uganda', isoCode: 'UG', code: '256' },
  { country: 'Senegal', isoCode: 'SN', code: '221' },
  { country: 'Cameroon', isoCode: 'CM', code: '237' },
  { country: 'Tanzania', isoCode: 'TZ', code: '255' }
]

export { options }
