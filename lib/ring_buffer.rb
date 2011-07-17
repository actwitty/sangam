module RingBuffer

  def ring_buffer(ring_array, limit, input_array)
    input_array.each do |id|
      if ring_array.size == limit
        ring_array.shift
      end
      ring_array.push id
    end
    ring_array
  end

end
