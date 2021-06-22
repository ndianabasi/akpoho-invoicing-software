import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import statesData from '../data/states'
import State from 'App/Models/State'
import Country from 'App/Models/Country'

export default class StateSeeder extends BaseSeeder {
  public async run() {
    for (const state of statesData) {
      const code = state.country_numeric_code
      const country = await Country.findBy('numeric_code', code)

      if (country) {
        const tempState = new State()
        tempState.name = state.name
        tempState.capital = state.capital
        tempState.countryNumericCode = code

        await country.related('states').save(tempState)
      }
    }
  }
}
