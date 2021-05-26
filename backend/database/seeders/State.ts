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
        const temp_state = new State()
        temp_state.name = state.name
        temp_state.capital = state.capital
        temp_state.countryNumericCode = code

        await country.related('states').save(temp_state)
      }
    }
  }
}
