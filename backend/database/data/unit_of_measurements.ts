import { itemCollectionTypes, unitOfMeasurementTypes } from 'App/Helpers/utils'
import { UnitOfMeasurementTypes } from 'App/Models/UnitOfMeasurement'
import { ItemCollectionType } from 'types/inventory'

const collectionTypes = itemCollectionTypes.map((type) => ({ name: type, type: 'collection' }))
const uomTypes = unitOfMeasurementTypes
  .filter((type) => !itemCollectionTypes.includes(type as ItemCollectionType))
  .map((type) => ({ name: type, type: 'discrete' as UnitOfMeasurementTypes }))

export default [...collectionTypes, ...uomTypes]
