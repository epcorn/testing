import { BsGlobe2 } from "react-icons/bs";
import { TfiShine } from "react-icons/tfi";
import { TiThMenu } from "react-icons/ti";
function Test() {
  return (
    <div id="features-section" className="max-w-4xl mx-auto ">
      <p className="text-center mt-9 font-sans">Tagline</p>
      <h1 className="text-3xl mt-4 text-center font-bold">Medium length features headline</h1>
      <p className="mt-7 text-gray-700 text-center">Lorem ipusm dolor sit amet et delectus accommodaare.</p>
      <div className="mt-9 flex gap-3">
        <div className="border border-gray-500 p-3 rounded-lg">
          <BsGlobe2  className="m-2 text-gray-500" />
          <h3 className="ml-2 my-2 font-bold text-lg">Medium length headline</h3>
          <p className="ml-2 my-2">Lorem ispusm dolor sit amet et delectus accomodare his consul copiosae.</p>
          <p className="ml-2 my-1">Read more</p>
        </div>
        <div className="border border-gray-500 p-3 rounded-lg">
          <TfiShine  className="m-2 text-gray-500" />
          <h3 className="ml-2 my-2 font-bold text-lg">Medium length headline</h3>
          <p className="ml-2 my-2">Lorem ispusm dolor sit amet et delectus accomodare his consul copiosae.</p>
          <p className="ml-2 my-1">Read more</p>
        </div>
        <div className="border border-gray-500 p-3 rounded-lg">
          <TiThMenu className="m-2 text-gray-500" />
          <h3 className="ml-2 my-2 font-bold text-lg">Medium length headline</h3>
          <p className="ml-2 my-2">Lorem ispusm dolor sit amet et delectus accomodare his consul copiosae.</p>
          <p className="ml-2 my-1">Read more</p>
        </div>
      </div>
    </div>
  )
}

export default Test