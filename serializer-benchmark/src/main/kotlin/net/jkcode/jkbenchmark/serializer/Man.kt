package net.jkcode.jkbenchmark.serializer

import net.jkcode.jkutil.common.generateId
import java.io.Serializable

data class Man(var name: String, var age: Int): Serializable {
    val id = generateId("man")

    override fun toString(): String {
        return "${javaClass.name}: id=$id, name=$name, age=$age"
    }
}
