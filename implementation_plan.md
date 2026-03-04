# implementation_plan.md

# [Fix HSN Code Fetching]

Provide a brief description of the problem, any background context, and what the change accomplishes.
The `BusinessVerification.tsx` component fetches company details from the `bv010` API, which returns available HSN details split into `services` and `goods` arrays. The user noticed that only one code (a service code) was appearing in the app, even though the company has multiple goods and services codes listed on the official GST portal.

This happens because the current frontend code uses an `else if` block:
```typescript
if (hsnData?.data?.hsnDetails?.services) {
  fetchedHsn = hsnData.data.hsnDetails.services;
} else if (hsnData?.data?.hsnDetails?.goods) {
  fetchedHsn = hsnData.data.hsnDetails.goods;
}
```
This logic explicitly drops all goods if any services exist, or drops all services if any goods exist.

## Proposed Changes

We will modify the frontend to aggregate both `goods` and `services` from the API response into a single array, ensuring all registered HSN/SAC codes are fetched and displayed on the next setup page.

### [Frontend Components]

#### [BusinessVerification.tsx](file:///Users/anushkaahire/Desktop/both/demo2final/src/app/pages/BusinessVerification.tsx)

- Update the `fetchGstDetails` method to concat the `goods` array and `services` array from `hsnData.data.hsnDetails`.
- Add safety checks to ensure we only concat valid arrays if they exist, to avoid mapping errors.

## Verification Plan

### Manual Verification
- Rebuild the application using `npm run build` to ensure there are no TypeScript errors.
- We will notify the user to test the Business Verification page again (since it relies on actual API credits, we will defer the specific PAN fetch test to them). The user can submit their test PAN (`AACCS7589K`) and verify that it navigates to the HSN Setup page with all 5 returned items (1 service, 4 goods).
