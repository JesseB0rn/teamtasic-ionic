import { DocumentReference } from '@angular/fire/firestore';

export class SessionUserData {
  uid: string;
  owner: string;
  name: string;
  email: string;
  birthdate: string;
  phoneNumber: string;
  emergencyContact: string;

  constructor(
    uid: string,
    owner: string,
    name: string,
    email: string,
    birthdate: string,
    phoneNumber: string,
    emergencyContact: string
  ) {
    this.uid = uid;
    this.owner = owner;
    this.name = name;
    this.email = email;
    this.birthdate = birthdate;
    this.phoneNumber = phoneNumber;
    this.emergencyContact = emergencyContact;
  }

  static converter = {
    fromFirestore(snapshot: any, options: any): SessionUserData {
      const data = snapshot.data(options);
      return new SessionUserData(
        snapshot.id,
        data.owner,
        data.name,
        data.email,
        data.birthdate,
        data.phoneNumber,
        data.emergencyContact
      );
    },
    toFirestore(data: SessionUserData): any {
      return {
        owner: data.owner,
        name: data.name,
        email: data.email,
        birthdate: data.birthdate,
        phoneNumber: data.phoneNumber,
        emergencyContact: data.emergencyContact,
      };
    },
  };
}