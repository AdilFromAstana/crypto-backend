import { Injectable, BadRequestException } from '@nestjs/common';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';
import BIP32Factory from 'bip32';
import { encrypt } from 'src/common/crypto.util';

const bip32 = BIP32Factory(ecc); // ✅ вот тут создаём API

@Injectable()
export class BitcoinWalletService {
  async generateWallet(): Promise<{
    address: string;
    encryptedPrivateKey: string;
    mnemonic: string;
  }> {
    try {
      const mnemonic = bip39.generateMnemonic();
      const seed = await bip39.mnemonicToSeed(mnemonic);

      const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
      const account = root.derivePath("m/44'/0'/0'/0/0");

      const { address } = bitcoin.payments.p2pkh({
        pubkey: Buffer.from(account.publicKey),
        network: bitcoin.networks.bitcoin,
      });

      if (!address) throw new Error('Не удалось создать BTC адрес');

      const privateKeyWIF = account.toWIF();
      const encryptedPrivateKey = encrypt(privateKeyWIF);

      return {
        address,
        encryptedPrivateKey,
        mnemonic,
      };
    } catch (e) {
      throw new BadRequestException(
        `Ошибка при создании BTC кошелька: ${e.message}`,
      );
    }
  }
}
