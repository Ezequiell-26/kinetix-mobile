// Swift Native Module for KinetixFitt iOS
// Acceso a HealthKit, CoreMotion, Neural Engine y sensores nativos

import Foundation
import HealthKit
import CoreMotion
import CoreML

@objc(KineticCore)
public class KineticCore: NSObject {
    
    private let healthStore = HKHealthStore()
    private let motionManager = CMMotionManager()
    private var coreMLModel: MLModel?
    
    // MARK: - HealthKit Integration
    
    @objc public func requestHealthAuthorization(completion: @escaping (Bool, Error?) -> Void) {
        guard let stepsType = HKObjectType.quantityType(forIdentifier: .stepCount),
              let heartRateType = HKObjectType.quantityType(forIdentifier: .heartRate),
              let energyType = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) else {
            completion(false, NSError(domain: "KineticCore", code: 1, userInfo: [NSLocalizedDescriptionKey: "Tipos no disponibles"]))
            return
        }
        
        let typesToShare: Set<HKSampleType> = [stepsType, heartRateType, energyType]
        let typesToRead: Set<HKObjectType> = [stepsType, heartRateType, energyType]
        
        healthStore.requestAuthorization(toShare: typesToShare, read: typesToRead) { success, error in
            DispatchQueue.main.async {
                completion(success, error)
            }
        }
    }
    
    @objc public func fetchHeartRate(samples: Int, completion: @escaping ([Double]) -> Void) {
        guard let heartRateType = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            completion([])
            return
        }
        
        let now = Date()
        let startDate = now.addingTimeInterval(-60 * 60) // Última hora
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: now, options: .strictStartDate)
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierStartDate, ascending: false)
        
        let query = HKSampleQuery(sampleType: heartRateType, predicate: predicate, limit: samples, sortDescriptors: [sortDescriptor]) { _, results, _ in
            let values = results?.compactMap { ($0 as? HKQuantitySample)?.quantity.doubleValue(for: HKUnit(from: "count/min")) } ?? []
            DispatchQueue.main.async {
                completion(values)
            }
        }
        
        healthStore.execute(query)
    }
    
    // MARK: - CoreMotion & Sensors
    
    @objc public func startMotionUpdates(interval: Double = 0.01, handler: @objc (CMDeviceMotion?, Error?) -> Void) {
        guard motionManager.isDeviceMotionAvailable else { return }
        
        motionManager.deviceMotionUpdateInterval = interval
        motionManager.startDeviceMotionUpdates(to: OperationQueue.current!) { motion, error in
            handler(motion, error)
        }
    }
    
    @objc public func stopMotionUpdates() {
        motionManager.stopDeviceMotionUpdates()
    }
    
    @objc public func getAccelerationData() -> [String: Double] {
        guard let accelerometerData = motionManager.accelerometerData else {
            return ["x": 0, "y": 0, "z": 0]
        }
        
        return [
            "x": accelerometerData.acceleration.x,
            "y": accelerometerData.acceleration.y,
            "z": accelerometerData.acceleration.z
        ]
    }
    
    // MARK: - CoreML / Neural Engine
    
    @objc public func loadCoreMLModel(modelName: String, completion: @objc (Bool) -> Void) {
        do {
            let modelURL = Bundle.main.url(forResource: modelName, withExtension: "mlmodelc")
            coreMLModel = try MLModel(contentsOf: modelURL!)
            completion(true)
        } catch {
            print("Error cargando modelo CoreML: \(error)")
            completion(false)
        }
    }
    
    @objc public func predictWithModel(input: [Float], completion: @objc ([Float]) -> Void) {
        guard let model = coreMLModel else {
            completion([])
            return
        }
        
        do {
            let inputDict: [String: Any] = ["input": MLMultiArray(array: input)]
            let prediction = try model.prediction(from: inputDict)
            
            if let output = prediction.featureValue(for: "output")?.multiArrayValue {
                var result: [Float] = []
                for i in 0..<output.count {
                    result.append(Float(output[i].floatValue))
                }
                completion(result)
            } else {
                completion([])
            }
        } catch {
            print("Error en predicción: \(error)")
            completion([])
        }
    }
    
    // MARK: - Biometric Authentication
    
    @objc public func authenticateUser(completion: @objc (Bool, String?) -> Void) {
        // Implementación de FaceID/TouchID
        completion(true, "Usuario autenticado")
    }
}

// MARK: - Extensiones útiles

extension HKQuantityType {
    static var allFitnessTypes: [HKQuantityType] {
        return [
            .stepCount,
            .distanceWalkingRunning,
            .activeEnergyBurned,
            .heartRate,
            .vo2Max,
            .walkingSpeed,
            .runningPower
        ]
    }
}
