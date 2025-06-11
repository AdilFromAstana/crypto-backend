import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ethers } from 'ethers';
import { encrypt } from 'src/common/crypto.util';

@Injectable()
export class EthereumWalletService {
  async generateWallet(): Promise<{
    address: string;
    privateKey: string;
    encryptedPrivateKey: string;
  }> {
    try {
      const wallet = ethers.Wallet.createRandom();
      const encryptedPrivateKey = encrypt(wallet.privateKey);

      return {
        address: wallet.address,
        privateKey: wallet.privateKey,
        encryptedPrivateKey,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при создании Ethereum кошелька: ' + error.message,
      );
    }
  }
}
