import { DESCRIPTIONS } from "../../constants"
import { AUXO_HELP_URL } from "../../utils"
import ExternalUrl from "../UI/url"

const FancyTitle = () => (
    <section className="flex flex-col mb-8">
        <h1 className="font-primary text-2xl my-5 flex flex-wrap items-center text-center justify-center">
            <span >Cross Chain & Layer 2 </span> 
            <span className="text-purple-600 my-2 mx-3 font-extrabold">Easy as 🥧</span>
        </h1>
    </section>
  )

const Callout = (): JSX.Element => {
    return (
        <section className={`
            w-full
            px-5 md:px-10 py-5
        `}>
            <div className="
                    mt-5
                    flex
                    items-center
                    justify-center
                    rounded-md
                    h-36
                    bg-blue-200
                "
            >
                <FancyTitle />
            </div>
            <div className="
                border-gradient
                rounded-md
                relative
                w-[95%]
                shadow-lg
                -top-10
                font-primary
            "><div className="
                p-5
                flex flex-col
                items-center
                justify-center
                ">
                    <p className="sm:w-3/4 md:w-1/2">
                        {DESCRIPTIONS.BANNER}
                    </p>
                    <ExternalUrl to={AUXO_HELP_URL}>
                        <p className="underline text-purple-700 underline-offset-2 mt-3">
                            Learn more about Auxo Vaults
                        </p>
                    </ExternalUrl>
                </div>
            </div>
        </section>
    )
}

export default Callout

