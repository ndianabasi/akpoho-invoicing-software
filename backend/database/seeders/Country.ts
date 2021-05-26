import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'
import countriesData from '../data/countries'

export default class CountrySeeder extends BaseSeeder {
  public async run() {
    for (const country of countriesData) {
      const countryObject = {
        name: country.name,
        capital: country.capital,
        citizenship: country.demonym,
        country_code: country.alpha2Code,
        calling_code: country.callingCodes?.[0] ?? null,
        flag: country.flag,
        numeric_code: country.numericCode,
        currency: country.currencies?.[0]?.name ?? null,
        currency_code: country.currencies?.[0]?.code ?? null,
        currency_symbol: country.currencies?.[0]?.symbol ?? null,
      }

      // Check if country exists
      const existingCountry = await Country.findBy('name', country.name)

      if (existingCountry) {
        // Update country
        await existingCountry.merge(countryObject).save()
      } else {
        // Else create country
        await Country.create(countryObject)
      }
    }
  }
}
