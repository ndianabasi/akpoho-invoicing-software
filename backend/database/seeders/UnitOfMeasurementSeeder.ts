import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import uoms from '../data/unit_of_measurements'
import UnitOfMeasurement from 'App/Models/UnitOfMeasurement'

export default class UnitOfMeasurementSeeder extends BaseSeeder {
  public async run() {
    for (let index = 0; index < uoms.length; index++) {
      const uom = uoms[index]

      await UnitOfMeasurement.updateOrCreate({ name: uom.name }, uom)
    }
  }
}
