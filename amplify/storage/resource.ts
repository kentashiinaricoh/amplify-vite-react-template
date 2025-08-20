import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'presetImages',
  isDefault: true, // identify your default storage bucket (required)
  access: (allow) => ({
    'public/*': [
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
    'protected/{entity_id}/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.entity('identity').to(['read', 'write', 'delete'])
    ],
    'private/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete'])
    ]
  })
});

export const firstBucket = defineStorage({
  name: 'firstBucket',
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
      allow.guest.to(['read', 'write', 'delete']),
      allow.authenticated.to(['read', 'write', 'delete']),
    ],
  }),
});
