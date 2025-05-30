/**
 * Taken From: https://stackoverflow.com/questions/8082405
 */
export class GoogleAddressParser {
  // @ts-expect-error do nothing
  private address: GoogleAddress = {};

  // @ts-expect-error do nothing
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
      // @ts-expect-error do nothing
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

  // @ts-expect-error do nothing
  private isStreetNumber(component: AddressComponent): boolean {
    return component.types.includes('street_number');
  }

  // @ts-expect-error do nothing
  private isStreetName(component: AddressComponent): boolean {
    return component.types.includes('route');
  }

  private isCity(component: any): boolean {
    return component.types.includes('locality') || component.types.includes('postal_town');
  }

  private isState(component: any): boolean {
    return component.types.includes('administrative_area_level_1');
  }

  private isCountry(component: any): boolean {
    return component.types.includes('country');
  }

  private isPostalCode(component: any): boolean {
    return component.types.includes('postal_code');
  }

  // @ts-expect-error do nothing
  result(): GoogleAddress {
    return this.address;
  }
}
