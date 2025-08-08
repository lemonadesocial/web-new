import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Address } from '$lib/graphql/generated/backend/graphql';
import { GoogleAddressParser } from './parser';
import { InputField } from '../input';

export function PlaceAutoComplete({
  label,
  placeholder,
  value,
  onSelect,
  autoFocus,
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onSelect?: (address: Address | undefined) => void;
  autoFocus?: boolean;
}) {
  const [toggle, setToggle] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [predictions, setPredictions] = React.useState<any>([]);

  React.useEffect(() => {
    if (query) {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions({ input: query }, (predictions) => {
        setPredictions(predictions);
      });
    } else {
      setPredictions([]);
    }
  }, [query]);

  React.useEffect(() => {
    setQuery(value || '');
    if (value && value !== query) {
      const autocompleteService = new window.google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions({ input: value }, (predictions) => {
        handleSelect(predictions?.[0]);
      });
    }
  }, [value]);

  const handleSelect = (prediction: any) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: prediction.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
        const parser = new GoogleAddressParser(place.address_components || []);
        const parsedAddress = parser.result();

        const address = {
          recipient_name: '',
          street_1:
            `${parsedAddress.street_number || ''} ${parsedAddress.street_name || prediction?.structured_formatting?.secondary_text || ''}`.trim(),
          street_2: '',
          city: parsedAddress.city || '',
          region: parsedAddress.state || '',
          postal: parsedAddress.postal_code || '',
          country: parsedAddress.country || '',
          title: prediction?.structured_formatting?.main_text || '',
          latitude: place.geometry?.location?.lat() || 0,
          longitude: place.geometry?.location?.lng() || 0,
          additional_directions: '',
        };
        setQuery(address?.title);
        onSelect?.(address);
        setToggle(false);
      }
    });
  };

  const handleClear = () => {
    setQuery('');
    setPredictions([]);
    setToggle(false);
    onSelect?.(undefined);
  };

  return (
    <div className="relative">
      <InputField
        label={label}
        autoFocus={autoFocus}
        iconLeft="icon-location-outline text-tertiary"
        right={{ icon: 'icon-cancel text-tertiary size-5 cursor-pointer', onClick: handleClear }}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.currentTarget.value);
          setToggle(true);
        }}
      />

      <AnimatePresence>
        {!!predictions?.length && toggle && (
          <motion.div
            // onClick={onClick}
            className="menu absolute border border-card-border rounded-sm bg-overlay-secondary [backdrop-filter:var(--backdrop-filter)] p-1 left-0 right-0 mt-2 z-50 shadow-md cursor-pointer"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
            initial="closed"
            animate="open"
            exit="closed"
            variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
          >
            {predictions?.map((prediction: any, idx: number) => (
              <div
                key={idx}
                className="flex gap-2.5 px-2 py-1.5 items-center hover:bg-[var(--btn-tertiary)] rounded-xs"
                onClick={() => handleSelect(prediction)}
              >
                <i className="icon-location-outline size-[20px] text-tertiary" />
                <div>
                  <p className="text-primary text-sm">{prediction?.structured_formatting?.main_text || ''}</p>
                  <p className="text-tertiary text-xs">{prediction?.structured_formatting?.secondary_text || ''}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
