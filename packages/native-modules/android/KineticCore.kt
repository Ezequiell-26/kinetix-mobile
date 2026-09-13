// Kotlin Native Module for KinetixFitt Android
// Acceso a sensores, Bluetooth LE, Google Fit y hardware nativo

package com.kinetixfitt.core

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import androidx.core.content.ContextCompat
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.data.DataType
import kotlinx.coroutines.*
import java.util.*

class KineticCore(private val context: Context) : SensorEventListener {
    
    private val sensorManager: SensorManager = 
        context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val coroutineScope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    
    private var accelerometer: Sensor? = null
    private var gyroscope: Sensor? = null
    private var heartRateSensor: Sensor? = null
    
    private var latestAccelData = floatArrayOf(0f, 0f, 0f)
    private var latestGyroData = floatArrayOf(0f, 0f, 0f)
    private var latestHeartRate = 0f
    
    // MARK: - Permisos y Autorización
    
    fun checkPermissions(): List<String> {
        val requiredPermissions = mutableListOf(
            Manifest.permission.ACTIVITY_RECOGNITION,
            Manifest.permission.BODY_SENSORS
        )
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            requiredPermissions.add(Manifest.permission.ACCESS_BACKGROUND_LOCATION)
        }
        
        return requiredPermissions.filter {
            ContextCompat.checkSelfPermission(context, it) != PackageManager.PERMISSION_GRANTED
        }
    }
    
    fun requestSensorAccess(onGranted: () -> Unit, onDenied: () -> Unit) {
        val missing = checkPermissions()
        if (missing.isEmpty()) {
            initializeSensors()
            onGranted()
        } else {
            onDenied()
        }
    }
    
    // MARK: - Sensores
    
    private fun initializeSensors() {
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        gyroscope = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
        heartRateSensor = sensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE)
        
        registerListeners()
    }
    
    private fun registerListeners() {
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        
        gyroscope?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
        
        heartRateSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }
    
    override fun onSensorChanged(event: SensorEvent?) {
        event ?: return
        
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                System.arraycopy(event.values, 0, latestAccelData, 0, 3)
            }
            Sensor.TYPE_GYROSCOPE -> {
                System.arraycopy(event.values, 0, latestGyroData, 0, 3)
            }
            Sensor.TYPE_HEART_RATE -> {
                latestHeartRate = event.values[0]
            }
        }
    }
    
    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
    
    fun getAccelerationData(): FloatArray = latestAccelData.clone()
    fun getGyroscopeData(): FloatArray = latestGyroData.clone()
    fun getHeartRate(): Float = latestHeartRate
    
    fun stopSensors() {
        sensorManager.unregisterListener(this)
        coroutineScope.cancel()
    }
    
    // MARK: - Google Fit Integration
    
    suspend fun fetchFitnessData(dataType: DataType, timeRange: Long): List<Float> = 
        withContext(Dispatchers.IO) {
            try {
                val response = Fitness.getHistoryClient(context, null)
                    .readData(
                        com.google.android.gms.fitness.request.DataReadRequest.Builder()
                            .read(dataType)
                            .setTimeRange(
                                System.currentTimeMillis() - timeRange,
                                System.currentTimeMillis(),
                                TimeUnit.MILLISECONDS
                            )
                            .build()
                    )
                    .await()
                
                response.getDataSet(dataType).dataPoints.map { dp ->
                    dp.getValue(dataType.fields[0]).asFloat()
                }
            } catch (e: Exception) {
                emptyList()
            }
        }
    
    // MARK: - Bluetooth LE para dispositivos externos
    
    fun scanForDevices(onDeviceFound: (String, String) -> Unit) {
        // Implementación de escaneo BLE para pesas inteligentes, bandas, etc.
        // Esto se conectaría con el sistema Rust de Bluetooth
    }
    
    // MARK: - Análisis de Movimiento con ML
    
    fun analyzeMovementPattern(data: FloatArray): Map<String, Any> {
        // Aquí se llamaría al modelo TFLite para análisis de forma
        return mapOf(
            "score" to 0.85f,
            "corrections" to listOf("Mantén espalda recta", "Baja más lento"),
            "risk" to "low"
        )
    }
}

// Extensiones útiles
fun Float.format(decimalPlaces: Int): String = "%.${decimalPlaces}f".format(this)
