interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleAddress {
  street_number?: string;
  street_name?: string;
  city?: string;
  country?: string;
  country_code?: string;
  state?: string;
  state_code?: string;
  postal_code?: string;
}

/**
 * Taken From: https://stackoverflow.com/questions/8082405
 */
export class GoogleAddressParser {
  private address: GoogleAddress = {};

  constructor(private address_components: Array<AddressComponent>) {
    this.parseAddress();
  }

  private parseAddress() {
    if (!Array.isArray(this.address_components)) {
      throw Error('Address Components is not an array');
    }

    if (!this.address_components.length) {
      throw Error('Address Components is empty');
    }

    for (let i = 0; i < this.address_components.length; i++) {
      const component: AddressComponent = this.address_components[i];

      if (this.isStreetNumber(component)) {
        this.address.street_number = component.long_name;
      }

      if (this.isStreetName(component)) {
        this.address.street_name = component.long_name;
      }

      if (this.isCity(component)) {
        this.address.city = component.long_name;
      }

      if (this.isCountry(component)) {
        this.address.country = component.long_name;
        this.address.country_code = component.short_name;
      }

      if (this.isState(component)) {
        this.address.state = component.long_name;
        this.address.state_code = component.short_name;
      }

      if (this.isPostalCode(component)) {
        this.address.postal_code = component.long_name;
      }
    }
  }

  private isStreetNumber(component: AddressComponent): boolean {
    return component.types.includes('street_number');
  }

  private isStreetName(component: AddressComponent): boolean {
    return component.types.includes('route');
  }

  private isCity(component: AddressComponent): boolean {
    return component.types.includes('locality') || component.types.includes('postal_town');
  }

  private isState(component: AddressComponent): boolean {
    return component.types.includes('administrative_area_level_1');
  }

  private isCountry(component: AddressComponent): boolean {
    return component.types.includes('country');
  }

  private isPostalCode(component: AddressComponent): boolean {
    return component.types.includes('postal_code');
  }

  result(): GoogleAddress {
    return this.address;
  }
}
