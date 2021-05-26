import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Country from 'App/Models/Country'
import State from 'App/Models/State'

export default class CountriesController {
  public async index({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}

  public async countryStatesForSelect({ response, params }: HttpContextContract) {
    const { country_id } = params
    if (country_id) {
      await Country.findOrFail(country_id)

      const states = await State.query()
        .select('id', 'name')
        .where('country_id', country_id)
        .orderBy('name', 'asc')

      const transformedStates = states.map((state) => {
        return {
          label: state.name,
          value: state.id,
        }
      })

      return response.ok({
        data: transformedStates,
      })
    } else {
      return response.badRequest({ message: 'No country ID was specified' })
    }
  }

  public async countriesForSelect({ response }: HttpContextContract) {
    const countries = await Country.query()
      .orderBy('name', 'asc')
      .select(...['id', 'name'])

    const transformedCountries = countries.map((country) => {
      return {
        label: country.name,
        value: country.id,
      }
    })

    return response.ok({
      data: transformedCountries,
    })
  }
}
