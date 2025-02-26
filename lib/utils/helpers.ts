export function isObjectId(_id: string) {
  return _id.match(/^[a-f\d]{24}$/);
}
