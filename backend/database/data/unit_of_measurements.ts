import { itemCollectionTypes, unitOfMeasurementTypes } from 'App/Helpers/utils'
import {
  ItemCollectionType,
  UnitOfMeasurementTypes,
  UnitsOfMeasurement,
} from 'App/Models/UnitOfMeasurement'

const collectionTypes = itemCollectionTypes.map((type) => ({
  name: type,
  type: 'collection' as UnitOfMeasurementTypes,
}))
const uomTypes = unitOfMeasurementTypes
  .filter((type) => !itemCollectionTypes.includes(type as ItemCollectionType))
  .map((type) => ({
    name: type as ItemCollectionType | UnitsOfMeasurement,
    type: 'discrete' as UnitOfMeasurementTypes,
  }))

export default [...collectionTypes, ...uomTypes]
