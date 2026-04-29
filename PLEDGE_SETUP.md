# iNHET Founding Pledge System - Setup Guide

## Overview

The Founding Pledge System is a **public pledge mechanism** (not a donation collection system) that allows supporters to commit future contributions while iNHET's legal registration is being completed.

**Key Features:**
- Live pledge counter with progress bar
- Public supporter wall (with anonymous option)
- Email notifications on pledge submission
- Admin panel for viewing/exporting pledges
- Automatic polling updates every 30 seconds

---

## Architecture

### Frontend
- **HTML/CSS**: Section in `index.html` with styles in `panchmela.css`
- **JavaScript**: Logic in `panchmela.js` (`initFoundingPledges()` function)
- **Admin Panel**: `pledge-admin.html` for managing pledges

### Backend
- **Database**: Supabase PostgreSQL
- **Table**: `founding_pledges`
- **RPC Functions**: `get_public_founding_pledges()` for secure data retrieval

---

## Setup Instructions

### Step 1: Supabase Schema Setup

1. Log in to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Create a **New Query**
5. Copy and paste the contents of `supabase-pledge-schema.sql`
6. Click **Run** to execute the SQL

This will create:
- `founding_pledges` table
- Row Level Security policies
- Public RPC function for safe data access
- Indexes for performance

### Step 2: Email Notifications (FormSubmit.co)

The system uses FormSubmit.co for email notifications. This is already configured in `panchmela.js`:

```javascript
await fetch('https://formsubmit.co/ajax/inhetedu@zohomail.in', {...})
```

**To customize:**
1. The email is sent to `inhetedu@zohomail.in` (already set)
2. The CC goes to the pledger's email
3. No additional setup required - FormSubmit.co works out of the box

### Step 3: Admin Panel Access

The admin panel is at: `pledge-admin.html`

**Security Note:** 
- The current admin panel uses the public anon key
- For production, you should:
  1. Set up Supabase Auth for admin users
  2. Create a separate admin role with restricted permissions
  3. Or password-protect the admin page using a simple .htaccess or similar

### Step 4: Testing

1. Open `index.html` in a browser
2. Scroll to the "Become a Founding Supporter" section
3. Click a pledge amount (₹500, ₹1,000, etc.)
4. Fill out the form:
   - Full Name: Test User
   - Email: your-test-email@example.com
   - Phone: +91 98765 43210
   - Message: Test pledge
   - Check "Display my name publicly"
5. Click "Make My Pledge"
6. Verify:
   - Success message appears
   - Email notification is sent
   - Counter updates
   - Your name appears on the supporter wall (if public)

---

## File Structure

```
NeofolkAtlas/
├── index.html                 # Contains the Founding Pledge section
├── panchmela.css              # Pledge section styles (pledge-*, .pledge-section)
├── panchmela.js               # Pledge logic (initFoundingPledges, foundingPledgeFetch)
├── pledge-admin.html          # Admin panel for managing pledges
├── supabase-pledge-schema.sql # Database setup script
└── PLEDGE_SETUP.md            # This file
```

---

## How It Works

### User Flow

1. **View Section**: User sees live pledge counter and progress bar
2. **Select Amount**: User clicks a preset amount or "Custom Amount"
3. **Open Modal**: Modal appears with selected amount displayed
4. **Fill Form**: User enters name, email, phone (optional), message
5. **Privacy Option**: User can choose to display name publicly or remain anonymous
6. **Submit**: Data is sent to Supabase
7. **Email Sent**: FormSubmit.co sends notification email
8. **Success State**: Modal shows confirmation message
9. **Live Update**: Counter and wall automatically refresh

### Data Flow

```
User Browser
    ↓
JavaScript (panchmela.js)
    ↓
Supabase API (public anon key)
    ↓
PostgreSQL Database
    ↓
FormSubmit.co (email notification)
```

### Security Considerations

1. **No Payment Processing**: No actual money is collected
2. **RLS Policies**: Only public name+amount data is readable by anonymous users
3. **Email Notifications**: Automatic emails sent on each pledge
4. **Admin Access**: Manual removal of spam entries via admin panel

---

## Customization

### Changing the Goal Amount

Edit `panchmela.js` line 7:
```javascript
const FOUNDING_PLEDGE_GOAL = 50000; // Change to your target amount
```

### Changing Currency

The system uses INR (₹) by default. To change:

1. Update `formatINR()` function in `panchmela.js`:
```javascript
function formatINR(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Change to your currency
    maximumFractionDigits: 0
  }).format(amount);
}
```

### Changing Pledge Amounts

Edit the buttons in `index.html` (around line 591-597):
```html
<button type="button" class="pledge-amount-card" data-amount="1000">₹1,000</button>
<!-- Add/remove buttons as needed -->
```

### Changing Email Recipients

In `panchmela.js` line 435:
```javascript
await fetch('https://formsubmit.co/ajax/YOUR-EMAIL@domain.com', {...})
```

---

## Troubleshooting

### Pledges Not Saving

1. Check browser console for errors
2. Verify Supabase credentials in meta tags:
   ```html
   <meta name="supabase-url" content="https://your-project.supabase.co" />
   <meta name="supabase-anon-key" content="your-anon-key" />
   ```
3. Verify SQL schema was executed successfully
4. Check RLS policies in Supabase dashboard

### Emails Not Sending

1. FormSubmit.co requires no setup - it works immediately
2. Check spam folders
3. Verify the email address is correct in `panchmela.js`

### Counter Not Updating

1. Check that `get_public_founding_pledges()` RPC function exists
2. Verify the function returns data by testing in Supabase SQL Editor:
   ```sql
   SELECT * FROM get_public_founding_pledges();
   ```

### Admin Panel Not Loading

1. Ensure `pledge-admin.html` is in the same directory as other files
2. Check that Supabase credentials are in the meta tags
3. Verify CORS settings in Supabase dashboard (Authentication → URL Configuration)

---

## Database Schema

### Table: `founding_pledges`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key, auto-generated |
| `full_name` | TEXT | Supporter's full name |
| `email` | TEXT | Supporter's email address |
| `phone` | TEXT | Optional phone number |
| `amount` | INTEGER | Pledge amount in INR |
| `message` | TEXT | Optional message from supporter |
| `display_publicly` | BOOLEAN | Whether to show name on public wall |
| `created_at` | TIMESTAMP | Auto-generated timestamp |
| `updated_at` | TIMESTAMP | Auto-updated on modification |

### RPC Function: `get_public_founding_pledges()`

Returns public pledge data for the supporter wall and counter:
- Shows "Anonymous" if `display_publicly = false`
- Shows actual name if `display_publicly = true`
- Sorted by most recent first

---

## Legal Disclaimer

The system includes a prominent disclaimer:

> "No funds are currently being collected. Pledges are non-binding expressions of future support until legal registration is complete."

This is critical for legal compliance. Do not remove this disclaimer.

---

## Support

For technical issues or questions about the pledge system:
- Check Supabase logs in the dashboard
- Review browser console for JavaScript errors
- Test the RPC functions directly in Supabase SQL Editor

---

## Future Enhancements

Potential improvements (not currently implemented):
- [ ] Admin authentication with Supabase Auth
- [ ] Pledge confirmation emails to supporters
- [ ] Bulk export with date filtering
- [ ] SMS notifications (via Twilio)
- [ ] Social sharing buttons after pledge
- [ ] Pledge editing (before legal registration completes)
