declare var GibberishAES: {
  Hash: {MD5()};
  Decrypt: boolean;
  Base64: {encode(d), decode(d)};
  size(newsize);
  h2a(s);
  expandKey(key);
  encryptBlock(block, words);
  decryptBlock(block, words);
  s2a(str: string, binary);
  rawEncrypt(plaintext, key, iv);
  rawDecrypt(cryptArr, key, iv, binary);
  dec(str, pass, binary?);
  openSSLKey(passwordArr, saltArr);
  a2h(numArr);
  enc(str, pass, binary?);
};
