// const RoomGallery = ({ room }) => {
//   return (
//     <section className="border border-red-400 my-5">
//       <img
//         src={room.images.heroImg}
//         alt={room.name}
//       />
//     </section>
//   )
// }

// export default RoomGallery


const RoomGallery = ({ room }) => {
  return (
    <section className="py-6 sm:py-8 lg:py-10">
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100 shadow-sm">
        <div className="aspect-[16/9] w-full sm:aspect-[2/1] lg:aspect-[21/9]">
          <img
            src={room.images.heroImg}
            alt={room.name}
            className="
              h-full
              w-full
              object-cover
            "
          />
        </div>
      </div>
    </section>
  )
}

export default RoomGallery