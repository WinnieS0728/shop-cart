'use client';

import { createEdgeStoreProvider } from '@edgestore/react';
import { EdgeStoreRouter } from '../libs/edgestore';

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 3
  });

export { EdgeStoreProvider, useEdgeStore };