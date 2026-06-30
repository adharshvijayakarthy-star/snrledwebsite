# Supabase Storage Setup for Payment Proofs

Follow these steps to create the payment-proofs bucket in your Supabase project:

## Steps

1. **Log in to Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your SNRLED project

2. **Navigate to Storage**
   - In the left sidebar, click on **Storage**

3. **Create a New Bucket**
   - Click the **Create a new bucket** button
   - Name: `payment-proofs`
   - Make it **Public** (toggle the public checkbox)
   - Click **Create bucket**

4. **Verify the Bucket**
   - You should now see `payment-proofs` listed in your storage buckets
   - The bucket icon should show it's public

5. **Test the Upload**
   - Go back to your app at http://localhost:3000
   - Complete the registration flow and try uploading a payment proof
   - The upload should now succeed

## What the Bucket Does

- Stores payment proof screenshots uploaded by users during registration
- Makes them publicly accessible so admins can view them in the registration details
- The uploaded image URL is stored in the `screenshot_url` field of each registration

## Storage Buckets Summary

Your project should have these buckets:
- `payment-proofs` (public) - Payment proof images
- `branding` (public) - Logo and branding assets  
- `gallery` (public) - Event gallery images
- `exports` (private, optional) - Exported Excel reports
