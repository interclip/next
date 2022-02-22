/**
 * This is a modified version of an example snippet in MDN for checking the availablility of localStorage or sessionStorage
 * https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#testing_for_availability
 */
export const storageAvailable = (type: 'localStorage' | 'sessionStorage') => {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (error) {
    return (
      error instanceof DOMException &&
      // everything except Firefox
      (error.code === 22 ||
        // Firefox
        error.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        error.name === 'QuotaExceededError' ||
        // Firefox
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
};
