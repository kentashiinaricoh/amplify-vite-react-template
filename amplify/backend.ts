import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { firstBucket, secondBucket, storage, thirdBucket } from './storage/resource';

defineBackend({
  auth,
  data,
  storage,
  firstBucket,
  secondBucket,
  thirdBucket,
});
