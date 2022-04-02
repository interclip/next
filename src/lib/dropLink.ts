import router from 'next/router';
import toast from 'react-hot-toast';
import { DropEvent } from 'src/typings/interclip';

import { requestClip } from './api/client/requestClip';

export async function droppable(element: HTMLElement, callback: Function) {
  element.addEventListener('dragenter', (event) => {
    event.stopPropagation();
    event.preventDefault();
  });

  element.addEventListener('dragleave', (event) => {
    event.stopPropagation();
    event.preventDefault();
  });

  element.addEventListener('dragover', (event) => {
    event.stopPropagation();
    event.preventDefault();
  });

  element.addEventListener('drop', (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (event.dataTransfer?.files) {
      callback(event);
    }
  });
}

export const dropLink = (e: DropEvent) => {
  if (e.dataTransfer) {
    const urls: Set<string> = new Set();

    // "Borrowed" from https://github.com/thinkverse/draggable/blob/ddb6d6ff23ef80fb60f80d4119586f4b0902e8f5/src/draggable.ts#L40-L46
    for (const item of e.dataTransfer.items) {
      if (['text/uri-list', 'text/plain'].includes(item.type)) {
        urls.add(e.dataTransfer.getData('URL'));
        continue;
      }
    }

    const firstURL = urls.values().next().value;
    if ([...urls].length !== 0 && firstURL && firstURL !== '') {
      toast.promise(
        new Promise((resolve, reject) => {
          requestClip(firstURL).then(async (clip) => {
            if (clip.status === 'success') {
              router.push(
                `/clip/${clip.result.code.slice(0, clip.result.hashLength)}`,
              );
              resolve('Success');
            } else {
              if (!clip) {
                reject(new Error('No clip returned'));
              }
              toast.error(clip.result);
              reject();
            }
          });
        }),
        {
          loading: 'Creating clip',
          success: 'Clip created',
          error: 'Error creating clip',
        },
      );
      return true;
    }
  }
};
