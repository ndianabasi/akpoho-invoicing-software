import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Country from 'App/Models/Country'
import State from 'App/Models/State'
import countriesStatesData from '../data/countries_states'

export default class StateSeeder2 extends BaseSeeder {
  public async run() {
    for (const countryData of countriesStatesData) {
      try {
        const countryCode = countryData.code2

        // Check if country exists, else create it.
        let country = await Country.findBy('country_code', countryCode)
        let countryNumericCode
        let countryID
        if (country) {
          countryID = country.id
          countryNumericCode = country.numericCode
        } else {
          country = await Country.create({
            name: countryData.name,
            capital: countryData.capital,
            countryCode: countryData.code2,
          })
          countryID = country.id
          countryNumericCode = country.numericCode || null
        }

        const states = countryData.states
        for (const state of states) {
          const stateName = state.name
          //console.log('stateName: ', stateName)
          //Check if state already exist in DB
          let stateExists = await State.query().where('name', stateName)

          if (stateExists && stateExists.length) {
            //console.log('stateExists: ', stateExists)
            //Check if state is in the same country
            const foundStateBelongsToSameCountry = stateExists.some(
              (state) => state.countryId === countryID
            )

            if (!foundStateBelongsToSameCountry) {
              await country.related('states').create({
                name: stateName,
                code: state.code,
                countryNumericCode: countryNumericCode || null,
              })
            }
          } else {
            await country.related('states').create({
              name: stateName,
              code: state.code,
              countryNumericCode: countryNumericCode || null,
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
