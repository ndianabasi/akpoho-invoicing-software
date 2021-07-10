import { itemCollectionTypes, unitOfMeasurementTypes } from 'App/Helpers/utils'
import { UnitOfMeasurementTypes } from 'App/Models/UnitOfMeasurement'

const collectionTypes = itemCollectionTypes.map((type) => ({ name: type, type: 'collection' }))
const uomTypes = unitOfMeasurementTypes
  .filter((type) => !itemCollectionTypes.includes(type))
  .map((type) => ({ name: type, type: 'discrete' as UnitOfMeasurementTypes }))

export default [...collectionTypes, ...uomTypes]
