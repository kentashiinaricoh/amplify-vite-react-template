import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'presetImages',
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],
  }),
});

export const firstBucket = defineStorage({
  name: 'firstBucket',
  isDefault: true, // identify your default storage bucket (required)
});

export const secondBucket = defineStorage({
  name: 'secondBucket',
  access: (allow) => ({
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
})

export const thirdBucket = defineStorage({
  name: 'thirdBucket',
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read']),
      allow.authenticated.to(['read']),
    ],
  }),
});
