const value = process.env.PROMPTFORGE_OWNER_NEW_PASSWORD || "";
console.log(JSON.stringify({ configured: Boolean(value), length: value.length }));
