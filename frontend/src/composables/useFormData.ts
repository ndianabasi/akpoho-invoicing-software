type BaseType = string | number | boolean | File | null | undefined;
type RawObjectProperties = BaseType &
  Array<BaseType> &
  Record<string, BaseType | Array<BaseType>>;

export type RawObject =
  | Record<string, RawObjectProperties | BaseType>
  | BaseType;

export default function objectToFormData(
  obj: RawObject,
  rootName?: string,
  ignoreList?: string[]
) {
  const formData: FormData | undefined = new FormData();

  function appendFormData(data: RawObject, root?: string) {
    if (!ignore(root)) {
      root = root || '';
      if (data instanceof File) {
        formData?.append(root, data);
      } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          appendFormData(data[i], `${root}[${i}]`);
        }
      } else if (typeof data === 'object' && data) {
        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '.' + key);
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined') {
          formData?.append(root, data as string | File);
        }
      }
    }
  }

  function ignore(root?: string) {
    return (
      Array.isArray(ignoreList) && ignoreList.some((item) => item === root)
    );
  }

  appendFormData(obj, rootName);

  return formData;
}
